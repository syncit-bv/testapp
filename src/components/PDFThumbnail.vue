<template>
<div
  class="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
  :style="{ width: `${previewSize}px` }"
>
  <div 
    class="aspect-[3/4] bg-gray-50 dark:bg-gray-900 relative flex items-center justify-center"
    :style="{ transform: file.rotation ? `rotate(${file.rotation}deg)` : undefined }"
    @click="op.toggle($event)"
  >
    <PDFPreview
      :file="file"
      :previewSize="previewSize"
      @error="handleError"
    />
    
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <Button
        icon="pi pi-refresh-ccw"
        @click.stop="$emit('rotate', -90)"
        class="p-button-rounded p-button-text p-button-sm"
        :class="{ 'p-button-secondary': darkMode }"
        title="Rotate Left"
      />
      <Button
        icon="pi pi-refresh-cw"
        @click.stop="$emit('rotate', 90)"
        class="p-button-rounded p-button-text p-button-sm"
        :class="{ 'p-button-secondary': darkMode }"
        title="Rotate Right"
      />
      <Button
        :icon="isExtracting ? 'pi pi-spinner pi-spin' : 'pi pi-download'"
        @click.stop="handleExtract"
        :disabled="isExtracting"
        class="p-button-rounded p-button-text p-button-sm"
        :class="{ 'p-button-secondary': darkMode }"
        title="Extract PDF"
      />
      <Button
        icon="pi pi-trash"
        @click.stop="$emit('delete')"
        class="p-button-rounded p-button-text p-button-sm p-button-danger"
        title="Delete"
      />
    </div>
  </div>
  
  <div class="p-2 text-sm truncate dark:text-gray-300">
    {{ file.name }}
  </div>
  
  <div 
    v-if="error"
    class="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center"
  >
    {{ error }}
  </div>

  <OverlayPanel ref="op" :class="{ 'dark-panel': darkMode }">
    <div class="w-80">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-semibold" :class="darkMode ? 'text-gray-200' : 'text-gray-700'">
          File Details
        </h3>
      </div>

      <div class="space-y-3">
        <MetadataItem
          icon="pi pi-file"
          label="Name"
          :value="file.name || 'Unnamed file'"
          :darkMode="darkMode"
        />
        
        <MetadataItem
          icon="pi pi-database"
          label="Size"
          :value="formatSize(file.size)"
          :darkMode="darkMode"
        />
        
        <MetadataItem
          icon="pi pi-calendar"
          label="Modified"
          :value="formatDate(file.lastModified)"
          :darkMode="darkMode"
        />

        <MetadataItem
          v-if="typeof file.numPages === 'number'"
          icon="pi pi-copy"
          label="Pages"
          :value="`${file.numPages} ${file.numPages === 1 ? 'page' : 'pages'}`"
          :darkMode="darkMode"
        />
      </div>
    </div>
  </OverlayPanel>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import PDFPreview from './PDFPreview.vue'
import MetadataItem from './MetadataItem.vue'
import type { SupportedFile } from '../types'

const props = defineProps<{
  file: SupportedFile
  index: number
  previewSize?: number
  darkMode?: boolean
}>()

const emit = defineEmits<{
  rotate: [degrees: number]
  extract: [file: SupportedFile]
  delete: []
}>()

const op = ref()
const error = ref<string | null>(null)
const isExtracting = ref(false)

const handleError = (errorMessage: string) => {
  error.value = errorMessage
}

const handleExtract = async () => {
  if (!props.file || props.file.type !== 'application/pdf') {
    handleError('Invalid file type. Only PDF files can be extracted.')
    return
  }

  isExtracting.value = true
  try {
    await emit('extract', props.file)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to extract PDF'
    handleError(errorMessage)
  } finally {
    isExtracting.value = false
  }
}

function formatSize(bytes: number | undefined): string {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return 'Unknown size'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

function formatDate(date: Date | number | undefined): string {
  if (!date) {
    return 'Unknown date'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date))
}
</script>

<style>
.p-overlaypanel.dark-panel {
  background: #1f2937;
  border-color: #374151;
}

.p-overlaypanel.dark-panel:before {
  border-bottom-color: #374151;
}

.p-overlaypanel.dark-panel:after {
  border-bottom-color: #1f2937;
}
</style>