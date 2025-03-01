import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server)
    return

  if (to.path === '/signin/callback')
    return
    
  if (to.path === '/signin')
    return

  if (isHydrated.value)
    return handleAuth(to)

  onHydrated(() => handleAuth(to))
})

function handleAuth(to: RouteLocationNormalized) {
  if (to.path === '/') {
    // Installed PWA shortcut to notifications
    if (to.query['notifications-pwa-shortcut'] !== undefined) {
      if (currentUser.value)
        return navigateTo('/notifications')
      else
        return navigateTo(`/${currentServer.value}/public/local`)
    }

    // Installed PWA shortcut to local
    if (to.query['local-pwa-shortcut'] !== undefined)
      return navigateTo(`/${currentServer.value}/public/local`)
  }

  // Vérifier si l'utilisateur est authentifié
  console.log('Auth middleware - currentUser:', currentUser.value)
  
  if (!currentUser.value) {
    // Si l'utilisateur n'est pas authentifié
    if (to.path === '/home' && to.query['share-target'] !== undefined) {
      return navigateTo('/share-target')
    } else {
      // Rediriger vers la page de connexion Keycloak
      console.log('Redirection vers /signin car utilisateur non authentifié')
      return navigateTo('/signin')
    }
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à la racine, rediriger vers /home
  if (to.path === '/')
    return navigateTo('/home')
}
