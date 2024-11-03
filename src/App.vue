<template>
<div class="min-h-screen" :class="darkMode ? 'dark bg-gray-900' : 'bg-gray-50'">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <div class="text-center flex-1">
        <h1 class="text-3xl font-bold mb-2" :class="darkMode ? 'text-white' : 'text-gray-900'">
          PDF Manager
        </h1>
        <p :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
          Upload, arrange, and manage your PDF files
        </p>
      </div>
      <Button
        @click="toggleDarkMode"
        :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'"
        :class="darkMode ? 'p-button-secondary' : 'p-button-primary'"
        aria-label="Toggle dark mode"
      />
    </header>

    <!-- Upload Area -->
    <UploadArea
      :isDraggingOver="isDraggingOver"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @fileSelect="handleFileUpload"
      :darkMode="darkMode"
    />

    <!-- PDF List -->
    <div v-if="files.length > 0" class="mt-8">
      <div class="flex justify-end mb-4">
        <PreviewSizeSlider 
          v-model="previewSize" 
          :min="150"
          :max="400"
          :step="25"
          :darkMode="darkMode"
        />
      </div>

      <TransitionGroup
        tag="div"
        class="grid gap-6"
        :style="gridStyle"
        name="file-list"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <PDFThumbnail
          v-for="(file, index) in files"
          :key="file.id"
          :file="file"
          :index="index"
          :previewSize="previewSize"
          :darkMode="darkMode"
          @rotate="handleRotate"
          @extract="handleExtract"
          @delete="handleDelete"
        />
      </TransitionGroup>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isProcessing" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <ProgressSpinner />
    </div>
  </div>

  <!-- Toast Messages -->
  <Toast position="bottom-right" />
  <ConfirmDialog />
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

import UploadArea from './components/UploadArea.vue'
import PDFThumbnail from './components/PDFThumbnail.vue'
import PreviewSizeSlider from './components/PreviewSizeSlider.vue'
import { createFileWithMetadata, isDuplicateFile, extractPDF } from './utils'
import type { SupportedFile } from './types'

const prefersDark = usePreferredDark()
const darkMode = ref(prefersDark.value)
const files = ref<SupportedFile[]>([])
const isProcessing = ref(false)
const isDraggingOver = ref(false)
const previewSize = ref(200)
const toast = useToast()
const confirm = useConfirm()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fill, minmax(${previewSize.value}px, 1fr))`,
  justifyItems: 'center'
}))

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
}

const showMessage = (severity: string, summary: string, detail: string) => {
  toast.add({ severity, summary, detail, life: 3000 })
}

const handleFiles = async (newFiles: FileList | File[]) => {
  isProcessing.value = true
  
  try {
    const fileArray = Array.from(newFiles)
    const processedFiles: SupportedFile[] = []
    const errors: string[] = []

    for (const file of fileArray) {
      try {
        const isDuplicate = await isDuplicateFile(file, files.value)
        if (isDuplicate) {
          errors.push(`File "${file.name}" is already added`)
          continue
        }

        const processedFile = await createFileWithMetadata(file)
        if (processedFile.error) {
          errors.push(processedFile.error)
        } else {
          processedFiles.push(processedFile)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('Error processing file:', errorMessage)
        errors.push(`Error processing file "${file.name}": ${errorMessage}`)
      }
    }
    
    if (processedFiles.length > 0) {
      files.value.push(...processedFiles)
      showMessage('success', 'Success', `Successfully added ${processedFiles.length} file(s)`)
    }

    if (errors.length > 0) {
      errors.forEach(error => showMessage('error', 'Error', error))
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error processing files:', errorMessage)
    showMessage('error', 'Error', `Error processing files: ${errorMessage}`)
  } finally {
    isProcessing.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    handleFiles(input.files)
    input.value = ''
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOver.value = false
  
  if (event.dataTransfer?.files) {
    handleFiles(event.dataTransfer.files)
  }
}

const handleRotate = (fileId: string, degrees: number) => {
  const fileIndex = files.value.findIndex(f => f.id === fileId)
  if (fileIndex !== -1) {
    const file = files.value[fileIndex]
    files.value[fileIndex] = {
      ...file,
      rotation: ((file.rotation || 0) + degrees) % 360
    }
  }
}

const handleExtract = async (file: SupportedFile) => {
  try {
    isProcessing.value = true
    const extractedPdf = await extractPDF(file, file.rotation || 0)
    
    const url = URL.createObjectURL(extractedPdf)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name.replace(/\.pdf$/, '') + (file.rotation ? '_rotated.pdf' : '.pdf')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showMessage('success', 'Success', `Successfully extracted "${file.name}"`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error extracting file:', errorMessage)
    showMessage('error', 'Error', `Failed to extract "${file.name}": ${errorMessage}`)
  } finally {
    isProcessing.value = false
  }
}

const handleDelete = (fileId: string) => {
  confirm.require({
    message: 'Are you sure you want to delete this file?',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const fileIndex = files.value.findIndex(f => f.id === fileId)
      if (fileIndex !== -1) {
        const file = files.value[fileIndex]
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl)
        }
        files.value.splice(fileIndex, 1)
        showMessage('info', 'Info', `Removed "${file.name}"`)
      }
    }
  })
}

// Animation handlers
const onBeforeEnter = (el: Element) => {
  (el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'scale(0.6)'
}

const onEnter = (el: Element, done: () => void) => {
  requestAnimationFrame(() => {
    (el as HTMLElement).style.transition = 'all 0.3s ease'
    ;(el as HTMLElement).style.opacity = '1'
    ;(el as HTMLElement).style.transform = 'scale(1)'
    done()
  })
}

const onLeave = (el: Element, done: () => void) => {
  ;(el as HTMLElement).style.transition = 'all 0.3s ease'
  ;(el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'scale(0.6)'
  setTimeout(done, 300)
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkMode.value)
})
</script>

<style>
.file-list-move,
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.3s ease;
}

.file-list-enter-from,
.file-list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.file-list-leave-active {
  position: absolute;
}
</style>