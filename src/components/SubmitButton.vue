<template>
  <p-button variant="default" type="submit">
    {{ action }}
  </p-button>
</template>

<script lang="ts" setup>
  import { FormAction } from '@/types/buttons'

  withDefaults(defineProps<{
    action?: FormAction,
  }>(), {
    action: 'Save',
  })
</script>