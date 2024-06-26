<template>
  <Transition name="work-queues-delete-button-transition">
    <p-button v-if="selected.length > 0" icon="TrashIcon" @click="open" />
  </Transition>
  <ConfirmDeleteModal
    v-model:showModal="showModal"
    name="selected work queues"
    label="Work Queues"
    @delete="deleteWorkQueues(selected)"
  />
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
  import { useShowModal, useWorkspaceApi } from '@/compositions'
  import { localization } from '@/localization'
  import { WorkQueue } from '@/models'
  import { getApiErrorMessage } from '@/utilities/errors'

  defineProps<{
    selected: WorkQueue[],
  }>()

  const emit = defineEmits<{
    (event: 'delete'): void,
  }>()

  const { showModal, open, close } = useShowModal()

  const api = useWorkspaceApi()

  const deleteWorkQueues = async (workQueues: WorkQueue[]): Promise<void> => {
    const toastMessage = computed(() => {
      if (workQueues.length === 1) {
        return localization.success.delete('Work queue')
      }
      return localization.success.delete(`${workQueues.length} work queues`)
    })

    try {
      const deleteWorkQueues = workQueues.map(queue => api.workQueues.deleteWorkQueue(queue.id))
      await Promise.all(deleteWorkQueues)
      showToast(toastMessage, 'success')
      emit('delete')
    } catch (error) {
      const message = getApiErrorMessage(error, localization.error.delete('work queues'))
      showToast(message, 'error')
    } finally {
      close()
    }
  }
</script>

<style>
.work-queues-delete-button-transition-enter-active,
.work-queues-delete-button-transition-leave-active {
  transition: opacity 0.25s ease;
}

.work-queues-delete-button-transition-enter-from,
.work-queues-delete-button-transition-leave-to {
  opacity: 0;
}
</style>