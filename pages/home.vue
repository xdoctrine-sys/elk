<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  alias: ['/signin/callback'],
})

const route = useRoute()
const router = useRouter()
const masto = useMasto()

// Traitement du callback de connexion Keycloak
if (import.meta.client && route.path === '/signin/callback') {
  // Récupérer les paramètres de l'URL
  const server = route.query.server as string
  const token = route.query.token as string
  const refreshToken = route.query.refresh_token as string
  const userInfoStr = route.query.user_info as string
  
  if (server && token) {
    console.log('Callback reçu avec server:', server, 'et token valide')
    
    // Essayer de parser les informations utilisateur si disponibles
    let userInfo = {}
    try {
      if (userInfoStr) {
        userInfo = JSON.parse(userInfoStr)
        console.log('Informations utilisateur reçues:', userInfo)
      }
    } catch (e) {
      console.error('Erreur lors du parsing des informations utilisateur:', e)
    }
    
    // Créer un compte factice pour l'authentification
    const account = {
      id: (userInfo as any).sub || 'keycloak-user',
      username: (userInfo as any).preferred_username || 'keycloak-user',
      display_name: (userInfo as any).name || 'Keycloak User',
      avatar: '',
      header: '',
      acct: (userInfo as any).preferred_username || 'keycloak-user',
      created_at: new Date().toISOString(),
      emojis: [],
      fields: [],
    }
    
    // Connecter l'utilisateur avec le token reçu
    console.log('Tentative de connexion avec:', { server, token, account })
    loginTo(masto, { 
      server, 
      token,
      account: account as any
    }).then(() => {
      console.log('Authentification réussie')
      // Stocker le refresh token si disponible
      if (refreshToken) {
        localStorage.setItem(`keycloak_refresh_token_${server}`, refreshToken)
      }
      // Rediriger vers la page d'accueil
      router.push('/home')
    }).catch((error) => {
      console.error('Erreur lors de la connexion:', error)
      router.push('/home')
    })
  } else {
    console.error('Paramètres manquants dans le callback:', route.query)
    // Si pas de token, rediriger simplement
    router.push('/home')
  }
}

const { t } = useI18n()
useHydratedHead({
  title: () => t('nav.home'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/home" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:home-5-line />
        <span>{{ $t('nav.home') }}</span>
      </NuxtLink>
    </template>

    <TimelineHome v-if="isHydrated" />
  </MainContent>
</template>
