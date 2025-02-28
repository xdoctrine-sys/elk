export default defineEventHandler(async (event) => {
  // Pour les requêtes OPTIONS (preflight CORS)
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.setHeader('Access-Control-Allow-Origin', '*')
    event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    event.node.res.setHeader('Access-Control-Max-Age', '86400')
    return {}
  }

  // Ajouter des headers CORS pour les autres requêtes
  event.node.res.setHeader('Access-Control-Allow-Origin', '*')

  const config = useRuntimeConfig()
  
  // Configuration Keycloak
  const keycloakServer = config.public.keycloak.server
  const keycloakRealm = config.public.keycloak.realm || 'master'
  const keycloakClientId = config.public.keycloak.clientId
  const keycloakClientSecret = config.keycloak.clientSecret
  
  if (!keycloakServer || !keycloakClientId || !keycloakClientSecret) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Configuration Keycloak manquante',
    })
  }

  // Récupérer le refresh token depuis le corps de la requête
  const body = await readBody(event)
  const { refreshToken } = body
  
  if (!refreshToken) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Refresh token manquant',
    })
  }

  try {
    // Échanger le refresh token contre un nouveau token d'accès
    const tokenEndpoint = `https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/token`
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: keycloakClientId,
        client_secret: keycloakClientSecret,
        refresh_token: refreshToken,
      }).toString(),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur lors du rafraîchissement du token:', response.status, errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Échec du rafraîchissement du token: ${response.statusText}`,
      })
    }
    
    const result = await response.json()

    // Retourner les nouveaux tokens
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in,
    }
  }
  catch (error) {
    console.error('Erreur lors du rafraîchissement du token Keycloak:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Échec du rafraîchissement du token',
    })
  }
}) 