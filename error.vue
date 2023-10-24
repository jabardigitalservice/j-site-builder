<template>
  <NuxtLayout v-if="error?.statusCode === 404">
    <UnderConstruction />
  </NuxtLayout>

  <NuxtLayout v-else-if="error?.statusCode === 401" name="public">
    <!-- TODO: improve design of unauthorized error  -->
    <h1 class="text-3xl font-bold">{{ error }}</h1>
  </NuxtLayout>

  <div v-else class="p-8">
    <h1 class="text-3xl font-bold">{{ error }}</h1>
    <button @click="handleError">Clear errors</button>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    error: {
      type: Object,
      default: null,
    },
  })
  const handleError = () => clearError({ redirect: '/' })
</script>
