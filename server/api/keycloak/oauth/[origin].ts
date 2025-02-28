import { stringifyQuery } from 'ufo'

export default defineEventHandler(async (event) => {
  const origin = decodeURIComponent(getRouterParams(event).origin)
  const config = useRuntimeConfig()
  
  // Configuration Keycloak
  const keycloakServer = config.public.keycloakServer
  const keycloakRealm = config.public.keycloakRealm || 'master'
  const keycloakClientId = config.public.keycloakClientId
  const keycloakClientSecret = config.keycloakClientSecret
  
  if (!keycloakServer || !keycloakClientId || !keycloakClientSecret) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Keycloak configuration is missing',
    })
  }

  const { code } = getQuery(event)
  if (!code) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Missing authentication code.',
    })
  }

  try {
    // Échange du code contre un token
    const tokenEndpoint = `https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/token`
    const result = await $fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: keycloakClientId,
        client_secret: keycloakClientSecret,
        code: code as string,
        redirect_uri: `${origin}/api/keycloak/oauth/${encodeURIComponent(origin)}`,
      }).toString(),
    })

    // Récupération des informations utilisateur
    const userInfoEndpoint = `https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`
    const userInfo = await $fetch(userInfoEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${result.access_token}`,
      },
    })

    // Redirection vers la page de callback avec le token
    const url = `/signin/callback?${stringifyQuery({ 
      server: keycloakServer,
      token: result.access_token,
      refresh_token: result.refresh_token,
      user_info: JSON.stringify(userInfo)
    })}`
    
    await sendRedirect(event, url, 302)
  }
  catch (error) {
    console.error('Keycloak authentication error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not complete log in.',
    })
  }
}) 