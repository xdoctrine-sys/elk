<script setup lang="ts">
// Utiliser le composable Keycloak pour l'authentification
const { busy, error, displayError, oauth } = useKeycloakSignIn()
const config = useRuntimeConfig()

// Récupérer les informations de configuration Keycloak
const keycloakServer = computed(() => config.public.keycloak.server)
const keycloakRealm = computed(() => config.public.keycloak.realm || 'master')
const keycloakEnabled = computed(() => config.public.keycloak.enabled)

// Rediriger directement vers Keycloak si la configuration est complète
onMounted(() => {
  if (keycloakEnabled.value && keycloakServer.value) {
    // Focus sur le bouton de connexion
    setTimeout(() => {
      document.querySelector('#keycloak-signin-button')?.focus()
    }, 100)
  }
})
</script>

<template>
  <form class="text-center justify-center items-center max-w-150 py6 flex flex-col gap-3" @submit.prevent="oauth">
    <div class="flex items-end mb2 gap-x-2 justify-center">
      <img :src="`/logo.svg`" class="w-12 h-12 mxa rtl-flip" height="48" width="48" :alt="$t('app_logo')">
      <div class="text-3xl">
        {{ $t('action.sign_in') }}
      </div>
    </div>
    
    <!-- Titre et description -->
    <div>
      {{ $t('user.keycloak_sign_in') || 'Connexion avec Keycloak' }}
    </div>
    <div class="text-secondary text-sm max-w-100 mb-2">
      {{ $t('user.keycloak_sign_in_desc') || "Connectez-vous avec votre compte Keycloak pour accéder à l'application." }}
    </div>
    
    <!-- Affichage des informations de connexion -->
    <div v-if="keycloakServer" class="text-sm text-secondary mb-2 p-2 bg-gray-5 rounded">
      <div><strong>Serveur :</strong> {{ keycloakServer }}</div>
      <div><strong>Realm :</strong> {{ keycloakRealm }}</div>
    </div>
    
    <!-- Message d'erreur -->
    <div v-if="displayError" role="alert" class="p-2 m-0 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded">
      {{ $t('error.sign_in_error') || 'Erreur de connexion. Veuillez réessayer.' }}
    </div>
    
    <!-- Bouton de connexion -->
    <button 
      id="keycloak-signin-button"
      class="flex flex-row gap-x-2 items-center btn-solid mt-4 px-6 py-2 text-lg"
      :disabled="busy"
      @click="oauth"
    >
      <span v-if="busy" aria-hidden="true" class="block animate animate-spin rtl-flip">
        <span class="block" i-ri:loader-2-fill aria-hidden="true"></span>
      </span>
      <span v-else aria-hidden="true" class="block rtl-flip" i-ri:login-circle-line></span>
      {{ $t('action.sign_in_with_keycloak') || 'Se connecter avec Keycloak' }}
    </button>
    
    <!-- Lien d'aide -->
    <div v-if="keycloakServer" class="text-secondary text-sm flex mt-4">
      <div class="me-1" i-ri-information-line />
      <span>
        {{ $t('user.keycloak_help', { 0: '' }) }}
        <a :href="`https://${keycloakServer}/realms/${keycloakRealm}/account`" target="_blank" class="text-primary hover:underline">
          {{ $t('user.keycloak_manage_account') || 'Gérer votre compte' }}
        </a>
      </span>
    </div>
  </form>
</template>
