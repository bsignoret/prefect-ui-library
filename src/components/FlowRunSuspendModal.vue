<template>
  <p-modal v-if="flowRun" v-model:showModal="internalValue" title="Suspend Flow Run">
    <p-label label="Current Flow Run State">
      <StateBadge :state="flowRun.state" />
    </p-label>
    <p-label label="Timeout" :message="timeoutErrorMessage" :state="timeoutState">
      <p-number-input v-model="timeout" min="5" :state="timeoutState" />
    </p-label>
    <div>
      Do you want to suspend {{ flowRun.name }}? This will put flow run into a <StateBadge :state="{ name: 'Suspended', type: 'paused' }" class="flow-run-suspend-modal__state-badge" /> state for {{ secondsToApproximateString(timeout) }}.
    </div>

    <template #actions>
      <p-button variant="default" :loading="isSubmitting" @click="submit">
        Submit
      </p-button>
    </template>
  </p-modal>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { addSeconds } from 'date-fns'
  import { useField } from 'vee-validate'
  import { computed, ref } from 'vue'
  import StateBadge from '@/components/StateBadge.vue'
  import { useForm, useWorkspaceApi } from '@/compositions'
  import { localization } from '@/localization'
  import { StateUpdateDetails } from '@/models'
  import { fieldRules, isGreaterThan, isRequired } from '@/utilities'
  import { getApiErrorMessage } from '@/utilities/errors'
  import { secondsToApproximateString } from '@/utilities/seconds'

  const props = defineProps<{
    showModal: boolean,
    flowRunId: string,
  }>()

  const defaultTimeout = ref<number>(300)

  const { handleSubmit, isSubmitting } = useForm()

  const { value: timeout, meta: timeoutState, errorMessage: timeoutErrorMessage } = useField<number>('timeout', fieldRules('Limit', isRequired, isGreaterThan(4)), { initialValue: defaultTimeout })

  const emit = defineEmits<{
    (event: 'update:showModal', value: boolean): void,
  }>()

  const api = useWorkspaceApi()

  const internalValue = computed({
    get() {
      return props.showModal
    },
    set(value: boolean) {
      emit('update:showModal', value)
    },
  })

  const flowRunSubscription = useSubscription(api.flowRuns.getFlowRun, [props.flowRunId])
  const flowRun = computed(() => flowRunSubscription.response)

  const submit = handleSubmit(async (formValues): Promise<void> => {
    try {
      const { timeout } = formValues
      const values: StateUpdateDetails = {
        type: 'paused',
        name: 'Suspended',
        stateDetails: {
          pauseTimeout: addSeconds(new Date(), timeout),
          pauseReschedule: true,
        },
      }
      await api.flowRuns.setFlowRunState(props.flowRunId, { state: values })
      flowRunSubscription.refresh()
      internalValue.value = false
      showToast(localization.success.suspendFlowRun, 'success')
    } catch (error) {
      console.error(error)
      const message = getApiErrorMessage(error, localization.error.suspendFlowRun)
      showToast(message, 'error')
    }
  })
</script>

<style>
.flow-run-suspend-modal__state-badge { @apply
    align-middle
}
</style>
