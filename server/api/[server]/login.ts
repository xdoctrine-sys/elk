import { stringifyQuery } from 'ufo'

export default defineEventHandler(async (event) => {
  const { origin, force_login, lang } = await readBody(event)
  
  // 🔹 Configuration Keycloak
  const keycloakBaseUrl = 'https://key.therichmountain.com'
  const realm = 'mastodon-sso'
  const clientId = 'mastodon'
  const redirectUri = `${origin}/signin/callback`

  // Construire l'URL d'autorisation Keycloak
  const query = stringifyQuery({
    client_id: clientId,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: redirectUri,
    // Conserver le paramètre force_login pour la compatibilité
    force_login: force_login === true ? 'true' : 'false',
    // Conserver le paramètre lang pour la compatibilité
    ui_locales: lang || 'fr',
  })

  // Retourner l'URL d'autorisation Keycloak
  return `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/auth?${query}`
})
