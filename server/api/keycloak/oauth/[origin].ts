import { getKeycloakRedirectURI, exchangeCodeForToken, getUserInfo, buildCallbackUrl } from '~/server/utils/keycloak'

export default defineEventHandler(async (event) => {
  const origin = decodeURIComponent(getRouterParams(event).origin)
  const config = useRuntimeConfig()
  
  // Configuration Keycloak
  const keycloakServer = config.public.keycloak.server
  const keycloakRealm = config.public.keycloak.realm || 'master'
  const keycloakClientId = config.public.keycloak.clientId
  const keycloakClientSecret = config.keycloak.clientSecret
  
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
    // Obtenir l'URI de redirection
    const redirectUri = getKeycloakRedirectURI(origin)
    
    // Échanger le code contre un token
    const result = await exchangeCodeForToken(
      code as string,
      redirectUri,
      keycloakServer,
      keycloakRealm,
      keycloakClientId,
      keycloakClientSecret
    )

    // Récupérer les informations utilisateur
    const userInfo = await getUserInfo(result.access_token, keycloakServer, keycloakRealm)

    // Rediriger vers la page de callback avec le token
    const url = buildCallbackUrl({ 
      server: keycloakServer,
      token: result.access_token,
      refresh_token: result.refresh_token,
      user_info: JSON.stringify(userInfo)
    })
    
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