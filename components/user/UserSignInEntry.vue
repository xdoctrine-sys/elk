<script setup lang="ts">
// Utiliser le composable Keycloak au lieu du composable standard
const { busy, oauth, keycloakEnabled } = useKeycloakSignIn()
</script>

<template>
  <div p8 lg:flex="~ col gap2" hidden>
    <p v-if="isHydrated" text-sm>
      <i18n-t keypath="user.sign_in_notice_title">
        <strong>{{ keycloakEnabled ? 'Keycloak' : currentServer }}</strong>
      </i18n-t>
    </p>
    <p text-sm text-secondary>
      {{ $t(keycloakEnabled ? 'user.keycloak_sign_in_desc' : 'user.sign_in_desc') }}
    </p>
    <button
      v-if="keycloakEnabled"
      flex="~ row" gap-x-2 items-center justify-center btn-solid text-center rounded-3
      :disabled="busy"
      @click="oauth()"
    >
      <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
        <span block i-ri:loader-2-fill aria-hidden="true" />
      </span>
      <span v-else aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      {{ $t('action.sign_in_with_keycloak') }}
    </button>
    <button v-else btn-solid rounded-3 text-center mt-2 select-none @click="openSigninDialog()">
      {{ $t('action.sign_in') }}
    </button>
  </div>
</template>
