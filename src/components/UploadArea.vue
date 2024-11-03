<template>
<div
  class="relative w-full p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer"
  :class="[
    isDraggingOver 
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
      : 'border-gray-300 hover:border-blue-500 bg-white dark:bg-gray-800',
    darkMode ? 'dark' : ''
  ]"
  @dragover.prevent="$emit('dragover', $event)"
  @dragleave.prevent="$emit('dragleave', $event)"
  @drop.prevent="$emit('drop', $event)"
>
  <input
    ref="fileInput"
    type="file"
    multiple
    accept=".pdf,.doc,.docx,.xls,.xlsx,.msg"
    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    @change="$emit('fileSelect', $event)"
  />
  
  <div class="flex flex-col items-center pointer-events-none">
    <i 
      class="pi pi-upload text-4xl mb-4"
      :class="isDraggingOver ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'"
    ></i>
    <span 
      class="text-sm"
      :class="isDraggingOver ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
    >
      {{ isDraggingOver ? 'Drop files here' : 'Drop files here or click to upload' }}
    </span>
    <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Supported format: PDF, Word, Excel, MSG
    </span>
  </div>
</div>
</template>

<script setup lang="ts">
defineProps<{
  isDraggingOver: boolean
  darkMode: boolean
}>()

defineEmits<{
  dragover: [event: DragEvent]
  dragleave: [event: DragEvent]
  drop: [event: DragEvent]
  fileSelect: [event: Event]
}>()
</script>