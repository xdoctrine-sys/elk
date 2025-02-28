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
          :loading="busy"
          @click="oauth"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeycloakSignIn } from '~/composables/keycloak'

// Utiliser le composable pour l'authentification Keycloak
const { busy, error, displayError, oauth } = useKeycloakSignIn()
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