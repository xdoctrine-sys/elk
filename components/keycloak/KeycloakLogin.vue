<template>
  <div class="keycloak-login">
    <div class="keycloak-login-header">
      <h2>{{ $t('auth.login_with_keycloak') }}</h2>
    </div>
    
    <div class="keycloak-login-content">
      <p>{{ $t('auth.keycloak_description') }}</p>
      
      <div class="keycloak-login-button">
        <CommonButton
          class="w-full"
          :label="$t('auth.login')"
          :loading="loading"
          @click="handleLogin"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// État
const loading = ref(false)

// Fonction pour gérer la connexion
function handleLogin() {
  loading.value = true
  
  try {
    // Récupérer la configuration Keycloak
    const config = useRuntimeConfig().public.keycloak
    
    if (!config || !config.server || !config.clientId) {
      console.error('Configuration Keycloak manquante')
      loading.value = false
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
    loading.value = false
  }
}
</script>

<style scoped>
.keycloak-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-bg-secondary);
}

.keycloak-login-header {
  margin-bottom: 1rem;
}

.keycloak-login-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.keycloak-login-button {
  margin-top: 1rem;
}
</style> 