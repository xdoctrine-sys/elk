import { ref } from 'vue'

/**
 * Composable pour gérer l'authentification Keycloak
 */
export function useKeycloakSignIn() {
  const busy = ref(false)
  const error = ref(false)
  const displayError = ref(false)

  async function oauth() {
    if (busy.value)
      return

    busy.value = true
    error.value = false
    displayError.value = false

    try {
      // Récupérer la configuration Keycloak
      const config = useRuntimeConfig().public.keycloak
      
      if (!config || !config.server || !config.clientId) {
        console.error('Configuration Keycloak manquante')
        displayError.value = true
        error.value = true
        busy.value = false
        return
      }
      
      // Construire l'URL de redirection
      const origin = window.location.origin
      const redirectUri = `${origin}/api/keycloak/oauth/${encodeURIComponent(origin)}`
      
      // Construire l'URL d'autorisation Keycloak
      const keycloakServer = config.server
      const keycloakRealm = config.realm || 'master'
      const keycloakClientId = config.clientId
      
      const authUrl = new URL(`https://${keycloakServer}/realms/${keycloakRealm}/protocol/openid-connect/auth`)
      authUrl.searchParams.append('client_id', keycloakClientId)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', 'openid profile email')
      
      // Rediriger vers Keycloak
      window.location.href = authUrl.toString()
    } catch (error) {
      console.error('Erreur lors de la redirection vers Keycloak:', error)
      displayError.value = true
      error.value = true
      busy.value = false
    }
  }

  return {
    busy,
    error,
    displayError,
    oauth
  }
} 