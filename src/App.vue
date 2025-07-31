<template>
  <div class="app">
    <header>
      <h1>useAsyncState Demo</h1>
      <p>A composable for handling async state with Vue 3's Suspense</p>
    </header>

    <main>
      <section class="demo-section">
        <h2>1. Manual Execution</h2>
        <p>This example shows manual execution with loading/error states.</p>
        <PostManual />
      </section>
      
      <section class="demo-section">
        <h2>2. Automatic Execution (with Suspense)</h2>
        <p>This example uses Vue's Suspense with automatic execution.</p>
        
        <!-- Error Boundary -->
        <div v-if="suspenseError" class="error">
          <h4>Error loading component</h4>
          <p>{{ suspenseError.message }}</p>
          <button @click="resetSuspense" class="retry-btn">
            Retry
          </button>
        </div>
        
        <!-- Suspense Component -->
        <Suspense v-else @resolve="handleSuspenseResolve" @fallback="handleSuspenseFallback">
          <template #default>
            <AsyncPost @error="handleSuspenseError" />
          </template>
          <template #fallback>
            <div class="suspense-fallback">
              <div class="spinner"></div>
              <p>Loading post with Suspense...</p>
            </div>
          </template>
        </Suspense>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PostManual from './components/PostManual.vue'
import AsyncPost from './components/AsyncPost.vue'

const suspenseError = ref<Error | null>(null)

const handleSuspenseError = (error: Error) => {
  console.error('Suspense error:', error)
  suspenseError.value = error
}

const handleSuspenseResolve = () => {
  console.log('Suspense resolved')
  suspenseError.value = null
}

const handleSuspenseFallback = () => {
  console.log('Suspense fallback')
}

const resetSuspense = () => {
  suspenseError.value = null
}
</script>

<style>
:root {
  --primary-color: #42b983;
  --error-color: #c62828;
  --border-color: #e0e0e0;
  --bg-color: #f9f9f9;
  --text-color: #2c3e50;
  --text-muted: #666;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
}

.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

h2 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
}

p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.demo-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.suspense-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(66, 185, 131, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

button:not(:last-child) {
  margin-right: 0.5rem;
}

button:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  background-color: #ffebee;
  color: var(--error-color);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid var(--error-color);
}

.error h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--error-color);
}

.retry-btn {
  margin-top: 1rem;
  background-color: #fff;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: #ffebee;
}
</style>
