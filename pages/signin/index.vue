<template>
  <div class="signin-page">
    <div class="signin-container">
      <div class="signin-header">
        <img src="/logo.svg" alt="Elk Logo" class="signin-logo" />
        <h1 class="signin-title">{{ $t('app_name') }}</h1>
      </div>
      
      <div class="signin-content">
        <KeycloakLogin />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<style scoped>
.signin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--color-bg);
}

.signin-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.signin-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.signin-logo {
  width: 64px;
  height: 64px;
}

.signin-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.signin-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style> 