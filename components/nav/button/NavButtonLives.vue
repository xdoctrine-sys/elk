<script setup lang="ts">
defineProps<{
  activeClass?: string
}>()
</script>

<template>
  <NuxtLink to="/lives" class="nav-button" :active-class="activeClass">
    <div i-ri:live-line />
    <span class="nav-label">{{ $t('nav.lives') }}</span>
  </NuxtLink>
</template> 