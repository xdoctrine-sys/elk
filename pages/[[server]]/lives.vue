<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.lives'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/lives" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:live-line />
        <span>{{ t('nav.lives') }}</span>
      </NuxtLink>
    </template>

    <div class="lives-container" p4>
      <h2 class="text-2xl mb-4">{{ $t('lives.title') }}</h2>
      
      <!-- Contenu temporaire pour la démo -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="live-card border border-base rounded-lg p-4">
          <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-3" />
          <h3 class="font-bold mb-2">Live Test #{{ i }}</h3>
          <p class="text-secondary">{{ $t('lives.description') }}</p>
        </div>
      </div>
    </div>
  </MainContent>
</template>

<style scoped>
.live-card {
  transition: transform 0.2s ease;
}

.live-card:hover {
  transform: translateY(-2px);
}
</style> 