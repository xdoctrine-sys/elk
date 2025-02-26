<script setup lang="ts">
import { STORAGE_KEY_FIRST_VISIT } from '~/constants'

defineProps<{
  activeClass?: string
}>()

// Vérifier si l'utilisateur a déjà vu le badge
const showBadge = ref(true)
const BADGE_STORAGE_KEY = 'elk-lives-badge-seen'

onMounted(() => {
  // Vérifier si le badge a déjà été vu
  if (process.client) {
    const badgeSeen = localStorage.getItem(BADGE_STORAGE_KEY)
    if (badgeSeen) {
      showBadge.value = false
    }
  }
})

// Fonction pour masquer le badge quand l'utilisateur clique sur le lien
function hideBadge() {
  showBadge.value = false
  if (process.client) {
    localStorage.setItem(BADGE_STORAGE_KEY, 'true')
  }
}
</script>

<template>
  <NuxtLink to="/lives" class="nav-button" :active-class="activeClass" @click="hideBadge">
    <div class="relative">
      <div i-ri:live-line />
      <!-- Badge NEW avec transition -->
      <Transition name="fade">
        <div 
          v-if="showBadge" 
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1 rounded-full"
          style="animation: pulse 2s infinite;"
        >
          NEW
        </div>
      </Transition>
    </div>
    <span class="nav-label">{{ $t('nav.lives') }}</span>
  </NuxtLink>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style> 