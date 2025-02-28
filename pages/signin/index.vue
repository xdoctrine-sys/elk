<template>
  <div class="signin-page">
    <div class="signin-container">
      <div class="signin-header">
        <img src="/logo.svg" alt="Elk Logo" class="signin-logo" />
        <h1 class="signin-title">{{ $t('app_name') }}</h1>
      </div>
      
      <div class="signin-content">
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
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'blank',
})

const loading = ref(false)
const error = ref('')

function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    // Récupérer la configuration Keycloak
    const config = useRuntimeConfig().public.keycloak
    
    if (!config || !config.server || !config.clientId) {
      error.value = 'Configuration Keycloak manquante'
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
    error.value = 'Erreur lors de la redirection vers Keycloak'
    loading.value = false
  }
}
</script>

<style scoped>
.signin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--color-bg);
}

.signin-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.signin-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.signin-logo {
  width: 64px;
  height: 64px;
}

.signin-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.signin-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

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

.error-message {
  color: var(--color-error);
  margin-top: 1rem;
  text-align: center;
}
</style> 