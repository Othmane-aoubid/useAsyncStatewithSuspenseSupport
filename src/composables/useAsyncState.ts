// useAsyncState.ts
import { ref } from 'vue'

type UseAsyncOptions = {
  immediate?: boolean
}

type Task<T> = (signal?: AbortSignal) => Promise<T>

export function useAsyncState<T>(
  task: Task<T>,
  options: UseAsyncOptions = { immediate: false }
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)
  let abortController: AbortController | null = null
  let currentPromise: Promise<unknown> | null = null

  const execute = async (): Promise<void> => {
    // Abort previous request if it exists
    if (abortController) {
      abortController.abort()
    }

    abortController = new AbortController()
    const currentExecution = task(abortController.signal)
    currentPromise = currentExecution
    pending.value = true
    error.value = null

    try {
      const result = await currentExecution
      if (currentPromise === currentExecution) {
        data.value = result
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        error.value = err instanceof Error ? err : new Error(String(err))
        if (currentPromise === currentExecution) {
          throw error.value
        }
      }
    } finally {
      if (currentPromise === currentExecution) {
        pending.value = false
        currentPromise = null
      }
    }
  }

  const abort = (): void => {
    if (abortController) {
      abortController.abort()
      abortController = null
      pending.value = false
      currentPromise = null
    }
  }

  // Implement thenable interface for Suspense support
  const thenable = {
    then(resolve: (value: any) => void, reject: (reason?: any) => void) {
      if (!currentPromise) {
        const promise = execute()
        return promise.then(() => data.value).then(resolve, reject)
      }
      return currentPromise.then(() => data.value).then(resolve, reject)
    }
  }

  // Start execution immediately if requested
  if (options.immediate) {
    execute()
  }

  // Return the state and methods
  const result = {
    data,
    error,
    pending,
    execute,
    abort
  }

  // Return a proxy that adds the then method when accessed with await
  return new Proxy(result, {
    get(target, prop, receiver) {
      if (prop === 'then') {
        return thenable.then.bind(thenable)
      }
      return Reflect.get(target, prop, receiver)
    }
  })
}