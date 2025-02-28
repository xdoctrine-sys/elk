import type { Ref } from 'vue'

export function useSignIn(input?: Ref<HTMLInputElement | undefined>) {
  const singleInstanceServer = useRuntimeConfig().public.singleInstance
  const userSettings = useUserSettings()
  const users = useUsers()
  const { t } = useI18n()

  const busy = ref(false)
  const error = ref(false)
  const server = ref('')
  const displayError = ref(false)

  async function oauth() {
    if (busy.value)
      return

    busy.value = true
    error.value = false
    displayError.value = false

    await nextTick()

    try {
      let href: string

      // 🚀 Remplacer l'authentification Mastodon par Keycloak
      const keycloakBaseUrl = 'https://key.therichmountain.com'
      const realm = 'mastodon-sso'
      const clientId = 'mastodon'
      const redirectUri = 'https://yulup.live/auth/callback' // Modifier avec ton URL

      const queryParams = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        scope: 'openid profile email',
        redirect_uri: redirectUri,
      }).toString()

      href = `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/auth?${queryParams}`

      // Redirige l'utilisateur vers Keycloak
      location.href = href
    }
    catch (err) {
      console.error('Erreur lors de la connexion avec Keycloak:', err)
      displayError.value = true
      error.value = true
      await nextTick()
      input?.value?.focus()
      await nextTick()
      setTimeout(() => {
        busy.value = false
        error.value = false
      }, 512)
    }
  }

  return { busy, displayError, error, server, singleInstanceServer, oauth }
}
