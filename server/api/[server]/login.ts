// import { stringifyQuery } from 'ufo'

// export default defineEventHandler(async (event) => {
//   let { server } = getRouterParams(event)
//   const { origin, force_login, lang } = await readBody(event)
//   server = server.toLocaleLowerCase().trim()
//   const app = await getApp(origin, server)

//   if (!app) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: `App not registered for server: ${server}`,
//     })
//   }

//   const query = stringifyQuery({
//     client_id: app.client_id,
//     force_login: force_login === true ? 'true' : 'false',
//     scope: 'read write follow push',
//     response_type: 'code',
//     lang,
//     redirect_uri: getRedirectURI(origin, server),
//   })

//   return `https://${server}/oauth/authorize?${query}`
// })

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'No authorization code received' })
  }

  const keycloakBaseUrl = 'https://key.therichmountain.com'
  const realm = 'mastodon-sso'
  const clientId = 'mastodon'
  const clientSecret = '<VOTRE_CLIENT_SECRET>'
  const redirectUri = 'https://yulup.live/auth/callback'

  try {
    // Échanger le code contre un token
    const response = await $fetch(`${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.access_token) {
      throw createError({ statusCode: 400, statusMessage: 'Failed to retrieve access token' })
    }

    // Stocker le token dans un cookie sécurisé
    setCookie(event, 'access_token', response.access_token, {
      httpOnly: true,
      secure: true
    })

    // Rediriger l'utilisateur vers la page d'accueil
    return sendRedirect(event, '/')
  }
  catch (error) {
    console.error('Erreur lors de la récupération du token Keycloak:', error)
    throw createError({ statusCode: 500, statusMessage: 'Keycloak token exchange failed' })
  }
})
