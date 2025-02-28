import { stringifyQuery } from 'ufo'
import { $fetch } from 'ofetch'

/**
 * Obtient l'URI de redirection pour l'authentification Keycloak
 */
export function getKeycloakRedirectURI(origin: string) {
  origin = origin.replace(/\?.*$/, '')
  return `${origin}/api/keycloak/oauth/${encodeURIComponent(origin)}`
}

/**
 * Échange un code d'autorisation contre un token d'accès
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
  keycloakServer: string,
  keycloakRealm: string,
  keycloakClientId: string,
  keycloakClientSecret: string
) {
  const tokenEndpoint = `https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/token`
  
  try {
    const result = await $fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: keycloakClientId,
        client_secret: keycloakClientSecret,
        code,
        redirect_uri: redirectUri,
      }).toString(),
    })
    
    return result
  } catch (error) {
    console.error("Erreur lors de l'échange du code contre un token:", error)
    throw error
  }
}

/**
 * Récupère les informations de l'utilisateur à partir du token d'accès
 */
export async function getUserInfo(accessToken: string, keycloakServer: string, keycloakRealm: string) {
  const userInfoEndpoint = `https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`
  
  try {
    const userInfo = await $fetch(userInfoEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    return userInfo
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error)
    throw error
  }
}

/**
 * Construit l'URL de callback avec les paramètres nécessaires
 */
export function buildCallbackUrl(params: Record<string, any>) {
  return `/signin/callback?${stringifyQuery(params)}`
} 