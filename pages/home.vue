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
  
  if (server && token) {
    // Connecter l'utilisateur avec le token reçu
    loginTo(masto, { 
      server, 
      token,
      account: {} as any // Sera rempli par loginTo
    }).then(() => {
      console.log('Authentification réussie')
      // Rediriger vers la page d'accueil
      router.push('/home')
    }).catch((error) => {
      console.error('Erreur lors de la connexion:', error)
      router.push('/home')
    })
  } else {
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
