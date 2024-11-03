<template>
<div class="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-sm">
  <Button
    icon="pi pi-minus"
    @click="updateValue(modelValue - step)"
    :disabled="modelValue <= min"
    class="p-button-text p-button-sm !p-0.5 !w-6 !h-6"
    :class="{ 'p-button-secondary': darkMode }"
    title="Decrease size"
  />
  
  <Slider
    v-model="localValue"
    :min="min"
    :max="max"
    :step="step"
    class="w-12"
  />
  
  <Button
    icon="pi pi-plus"
    @click="updateValue(modelValue + step)"
    :disabled="modelValue >= max"
    class="p-button-text p-button-sm !p-0.5 !w-6 !h-6"
    :class="{ 'p-button-secondary': darkMode }"
    title="Increase size"
  />
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Slider from 'primevue/slider'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  darkMode?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const updateValue = (value: number) => {
  const newValue = Math.max(props.min ?? 150, Math.min(props.max ?? 400, value))
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
:deep(.p-slider) {
  height: 0.25rem;
}

:deep(.p-slider .p-slider-handle) {
  height: 0.75rem;
  width: 0.75rem;
  margin-top: -0.25rem;
  margin-left: -0.375rem;
}

:deep(.p-button.p-button-sm) {
  padding: 0.25rem;
}

:deep(.p-button.p-button-sm .p-button-icon) {
  font-size: 0.75rem;
}
</style>