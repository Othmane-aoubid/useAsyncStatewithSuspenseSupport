<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncState } from '../composables/useAsyncState'

// Add a small delay to make the loading state more visible
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Non-await usage - will not trigger Suspense
const { data, pending, error, execute, abort } = useAsyncState(
  async () => {
    // Add artificial delay to make loading state visible
    await delay(1000) // 1 second delay
    
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },
  { immediate: false } // Don't auto-fetch on mount
)

const handleExecute = async () => {
  try {
    await execute()
  } catch (err) {
    console.error('Error executing request:', err)
  }
}
</script>

<template>
  <div class="post-manual">
    <h3>Manual Execution Example</h3>
    
    <div v-if="pending">
      Loading post...
    </div>
    
    <div v-else-if="error" class="error">
      Error: {{ error.message }}
    </div>
    
    <div v-else-if="data" class="post-content">
      <h4>{{ data.title }}</h4>
      <p>{{ data.body }}</p>
    </div>

    <div class="actions">
      <button 
        @click="handleExecute" 
        :disabled="pending"
        :class="{ 'loading': pending }"
      >
        <span v-if="!pending">Fetch Post</span>
        <span v-else>Loading...</span>
      </button>
      <button 
        @click="abort" 
        :disabled="!pending" 
        class="cancel-btn"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
.post-manual {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.post-content {
  margin: 1rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

button {
  position: relative;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 100px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

button.loading {
  color: transparent;
  pointer-events: none;
}

button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-right-color: transparent;
  animation: button-spinner 0.75s linear infinite;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #ffebee;
  color: #c62828;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #ffcdd2;
}

.error {
  color: #c62828;
  background-color: #ffebee;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
}

@keyframes button-spinner {
  to { transform: rotate(360deg); }
}
</style>
