<script setup lang="ts">
// Utiliser le composable Keycloak au lieu du composable standard
const { busy, oauth, keycloakEnabled } = useKeycloakSignIn()
</script>

<template>
  <div class="p8 hidden lg:flex lg:flex-col lg:gap2">
    <p v-if="isHydrated" class="text-sm">
      <i18n-t keypath="user.sign_in_notice_title">
        <strong>{{ keycloakEnabled ? 'Keycloak' : currentServer }}</strong>
      </i18n-t>
    </p>
    <p class="text-sm text-secondary">
      {{ $t(keycloakEnabled ? 'user.keycloak_sign_in_desc' : 'user.sign_in_desc') }}
    </p>
    <button
      v-if="keycloakEnabled"
      class="flex flex-row gap-x-2 items-center justify-center btn-solid text-center rounded-3"
      :disabled="busy"
      @click="oauth()"
    >
      <span v-if="busy" aria-hidden="true" class="block animate animate-spin rtl-flip">
        <span class="block" i-ri:loader-2-fill aria-hidden="true"></span>
      </span>
      <span v-else aria-hidden="true" class="block rtl-flip" i-ri:login-circle-line></span>
      {{ $t('action.sign_in_with_keycloak') }}
    </button>
    <button v-else class="btn-solid rounded-3 text-center mt-2 select-none" @click="openSigninDialog()">
      {{ $t('action.sign_in') }}
    </button>
  </div>
</template>
