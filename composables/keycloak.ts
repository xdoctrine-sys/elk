import { useNuxtApp } from '#imports'

/**
 * Composable pour gérer l'authentification Keycloak
 */
export function useKeycloak() {
  const config = useNuxtApp().$config
  const keycloakServer = config.public.keycloak.server
  const keycloakRealm = config.public.keycloak.realm || 'master'
  const keycloakClientId = config.public.keycloak.clientId

  /**
   * Initialise le processus d'authentification Keycloak
   */
  function login() {
    if (!keycloakServer || !keycloakClientId) {
      console.error('Configuration Keycloak manquante')
      return
    }

    // Construire l'URL de redirection
    const origin = window.location.origin
    const redirectUri = `${origin}/api/keycloak/oauth/${encodeURIComponent(origin)}`
    
    // Construire l'URL d'autorisation Keycloak
    const authUrl = new URL(`https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/auth`)
    authUrl.searchParams.append('client_id', keycloakClientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', 'openid profile email')
    
    // Rediriger vers Keycloak
    window.location.href = authUrl.toString()
  }

  /**
   * Rafraîchit le token d'accès à l'aide du refresh token
   */
  async function refreshToken(server: string, refreshToken: string) {
    try {
      const response = await fetch(`/api/keycloak/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })
      
      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      return null
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  function logout() {
    // Supprimer les tokens stockés
    const server = keycloakServer
    if (server) {
      localStorage.removeItem(`keycloak_refresh_token_${server}`)
    }
    
    // Rediriger vers la page de déconnexion de Keycloak
    const logoutUrl = new URL(`https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/logout`)
    logoutUrl.searchParams.append('client_id', keycloakClientId)
    logoutUrl.searchParams.append('redirect_uri', window.location.origin)
    
    window.location.href = logoutUrl.toString()
  }

  return {
    login,
    refreshToken,
    logout,
    keycloakServer,
    keycloakRealm,
    keycloakClientId,
  }
} 