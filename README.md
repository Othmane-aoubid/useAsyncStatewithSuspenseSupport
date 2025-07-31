# useAsyncState with Suspense Support

A Vue 3 composable for handling async state with built-in Suspense support, request cancellation, and error handling.

## Features

- 🚀 Built-in Suspense support
- 🔄 Automatic request cancellation
- 🛑 AbortController integration
- 📊 Reactive state management
- 🎣 Easy to use with Vue 3's Composition API

## Installation

```bash
npm install useaysnc
# or
yarn add useaysnc
# or
pnpm add useaysnc
```

## Basic Usage

```typescript
import { useAsyncState } from 'useaysnc'

// In your component setup
const { data, pending, error, execute, abort } = useAsyncState(
  async (signal) => {
    const response = await fetch('/api/data', { signal })
    return response.json()
  },
  { immediate: true }
)
```

## With Suspense

```vue
<template>
  <Suspense>
    <template #default>
      <div v-if="data">
        {{ data }}
      </div>
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup>
import { useAsyncState } from 'use-async-state-suspense'

const { data } = useAsyncState(
  async () => {
    const response = await fetch('/api/data')
    return response.json()
  },
  { immediate: true }
)
</script>
```

## API

### Parameters

- `task`: `(signal?: AbortSignal) => Promise<T>` - The async function to execute
- `options` (optional):
  - `immediate`: `boolean` - Whether to execute the task immediately (default: `false`)

### Return Value

- `data`: `Ref<T | null>` - The result of the async operation
- `error`: `Ref<Error | null>` - Any error that occurred during execution
- `pending`: `Ref<boolean>` - Whether the operation is in progress
- `execute`: `() => Promise<void>` - Function to manually trigger the async operation
- `abort`: `() => void` - Function to cancel the current operation


