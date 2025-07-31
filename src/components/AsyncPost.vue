<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAsyncState } from '../composables/useAsyncState'

const error = ref<Error | null>(null)

// This will be called when the component is mounted
const { data } = useAsyncState(
  async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw error.value // This will be caught by Suspense
    }
  },
  { immediate: true } // This will execute immediately
)
</script>

<template>
  <div class="async-post">
    <div v-if="error" class="error">
      <h4>Error loading post</h4>
      <p>{{ error.message }}</p>
    </div>
    <div v-else-if="data" class="post-content">
      <h4>{{ data.title }}</h4>
      <p>{{ data.body }}</p>
    </div>
    <div v-else>
      <!-- This should not be visible as Suspense will show the fallback -->
      Loading...
    </div>
  </div>
</template>

<style scoped>
.async-post {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #c62828;
}

.error h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #c62828;
}

.post-content {
  padding: 1rem 0;
}

h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

p {
  margin: 0;
  color: #34495e;
  line-height: 1.6;
}
</style>
