import { stringifyQuery } from 'ufo'
import { defaultUserAgent } from '~/server/utils/shared'

export default defineEventHandler(async (event) => {
  const { origin } = getRouterParams(event)
  const { code } = getQuery(event)

  if (!code) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Missing authentication code.',
    })
  }

  // 🔹 Configuration Keycloak
  const keycloakBaseUrl = 'https://key.therichmountain.com'
  const realm = 'mastodon-sso'
  const clientId = 'mastodon'
  const clientSecret = 'PS8dUikZiOaLSK0hrcX83e3hXcjKYxGu'
  const redirectUri = `${origin}/signin/callback` // Modifier pour utiliser /signin/callback

  try {
    // 🔹 Échanger le `code` contre un `token` dans Keycloak
    const result: any = await $fetch(`${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'user-agent': defaultUserAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code,
      }),
      retry: 3,
    })

    if (!result.access_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to retrieve access token from Keycloak.',
      })
    }

    // 🔹 Stocker le token dans un cookie sécurisé
    setCookie(event, 'access_token', result.access_token, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    // 🔹 Redirection après connexion réussie - Utiliser le même format que l'ancien code
    const url = `/signin/callback?${stringifyQuery({ token: result.access_token })}`
    await sendRedirect(event, url, 302)
  }
  catch (error) {
    console.error("Erreur lors de l'échange de code avec Keycloak:", error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not complete log in with Keycloak.',
    })
  }
})