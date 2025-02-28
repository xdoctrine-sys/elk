import { stringifyQuery } from 'ufo'

export default defineEventHandler(async (event) => {
  const { origin, force_login, lang } = await readBody(event)
  const config = useRuntimeConfig()
  
  // Configuration Keycloak
  const keycloakServer = config.public.keycloakServer
  const keycloakRealm = config.public.keycloakRealm || 'master'
  const keycloakClientId = config.public.keycloakClientId
  
  if (!keycloakServer || !keycloakClientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Keycloak configuration is missing',
    })
  }

  const query = stringifyQuery({
    client_id: keycloakClientId,
    redirect_uri: `${origin}/api/keycloak/oauth/${encodeURIComponent(origin)}`,
    response_type: 'code',
    scope: 'openid profile email',
  })

  return `https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/auth?${query}`
}) 