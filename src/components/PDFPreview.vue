<template>
<div class="relative w-full h-full flex items-center justify-center">
  <VuePdfEmbed
    v-if="file.previewUrl"
    :source="file.previewUrl"
    :page="1"
    :width="previewSize"
    @error="handleError"
  />
  
  <div
    v-else
    class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div class="flex flex-col items-center gap-2 px-4 text-center">
      <i class="pi pi-exclamation-circle text-red-500 text-xl"></i>
      <span class="text-sm text-gray-600 dark:text-gray-400">Preview not available</span>
    </div>
  </div>

  <div
    v-if="file.numPages && file.numPages > 0"
    class="absolute bottom-2 right-2 bg-gray-800/75 text-white px-2 py-1 rounded text-xs"
  >
    {{ file.numPages }} {{ file.numPages === 1 ? 'page' : 'pages' }}
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import type { SupportedFile } from '../types'

const props = defineProps<{
  file: SupportedFile
  previewSize: number
}>()

const emit = defineEmits<{
  error: [message: string]
}>()

const handleError = (error: Error) => {
  console.error('PDF Preview Error:', error)
  emit('error', 'Failed to load PDF preview')
}

onMounted(() => {
  if (!props.file.previewUrl) {
    emit('error', 'Preview not available')
  }
})
</script>