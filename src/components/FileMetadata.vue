<template>
<div 
  class="absolute inset-0 rounded-lg shadow-lg z-10"
  :class="darkMode ? 'bg-gray-800' : 'bg-white'"
>
  <div class="p-4">
    <div class="flex items-start justify-between mb-4">
      <h3 
        class="text-lg font-semibold"
        :class="darkMode ? 'text-gray-200' : 'text-gray-700'"
      >
        File Details
      </h3>
      <Button
        icon="pi pi-times"
        @click="$emit('close')"
        class="p-button-text p-button-sm p-button-rounded"
        :class="{ 'p-button-secondary': darkMode }"
      />
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
</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import MetadataItem from './MetadataItem.vue'
import type { SupportedFile } from '../types'

const props = defineProps<{
  file: SupportedFile
  darkMode?: boolean
}>()

defineEmits<{
  close: []
}>()

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