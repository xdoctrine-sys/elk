import type { Ref } from 'vue'

export function useKeycloakSignIn() {
  const userSettings = useUserSettings()
  const users = useUsers()
  const { t } = useI18n()
  const config = useRuntimeConfig()
  
  // Vérifier si Keycloak est activé
  const keycloakEnabled = config.public.keycloak.enabled

  const busy = ref(false)
  const error = ref(false)
  const displayError = ref(false)

  async function oauth() {
    if (busy.value)
      return

    busy.value = true
    error.value = false
    displayError.value = false

    await nextTick()

    try {
      const href = await (globalThis.$fetch as any)(`/api/keycloak/login`, {
        method: 'POST',
        body: {
          force_login: users.value.length > 0,
          origin: location.origin,
          lang: userSettings.value.language,
        },
      })
      location.href = href
    }
    catch (err) {
      console.error(err)
      displayError.value = true
      error.value = true
      await nextTick()
      setTimeout(() => {
        busy.value = false
        error.value = false
      }, 512)
    }
  }

  return { busy, displayError, error, oauth, keycloakEnabled }
} 