<script setup lang="ts">
const { busy, error, displayError, oauth } = useKeycloakSignIn()
</script>

<template>
  <form text-center justify-center items-center max-w-150 py6 flex="~ col gap-3" @submit.prevent="oauth">
    <div flex="~ center" items-end mb2 gap-x-2>
      <img :src="`/${''}logo.svg`" w-12 h-12 mxa height="48" width="48" :alt="$t('app_logo')" class="rtl-flip">
      <div text-3xl>
        {{ $t('action.sign_in') }}
      </div>
    </div>
    <div>
      {{ $t('user.keycloak_sign_in') }}
    </div>
    <div :class="error ? 'animate animate-shake-x animate-delay-100' : null">
      <div min-h-4>
        <Transition css enter-active-class="animate animate-fade-in">
          <p v-if="displayError" role="alert" p-0 m-0 text-xs text-red-600 dark:text-red-400>
            {{ $t('error.sign_in_error') }}
          </p>
        </Transition>
      </div>
    </div>
    <button flex="~ row" gap-x-2 items-center btn-solid mt2 :disabled="busy">
      <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
        <span block i-ri:loader-2-fill aria-hidden="true" />
      </span>
      <span v-else aria-hidden="true" block i-ri:login-circle-line class="rtl-flip" />
      {{ $t('action.sign_in_with_keycloak') }}
    </button>
  </form>
</template> 