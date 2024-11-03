<template>
<div class="flex items-center gap-2">
  <i :class="[`pi ${icon}`, darkMode ? 'text-gray-400' : 'text-gray-600']"></i>
  <span :class="[darkMode ? 'text-gray-400' : 'text-gray-500', 'min-w-[80px]']">
    {{ label }}:
  </span>
  <span :class="darkMode ? 'text-gray-200' : 'text-gray-700'" class="break-all">
    {{ value }}
  </span>
</div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string
  darkMode?: boolean
}>()
</script>