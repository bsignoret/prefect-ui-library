<template>
  <div class="automation-action-description-run-deployment" v-bind="$attrs">
    <template v-if="action.deploymentId">
      <span class="automation_action-description-run-deployment__deployment">Run deployment: <DeploymentIconText :deployment-id="action.deploymentId" /></span>

      <p-button size="sm" @click="openParametersModal">
        Show parameters
      </p-button>

      <template v-if="action.jobVariables">
        <p-button size="sm" @click="openJobVariablesModal">
          Show job variables
        </p-button>
      </template>
    </template>

    <template v-else>
      <span>Run deployment inferred from the triggering event</span>
    </template>
  </div>

  <p-modal v-model:show-modal="showParametersModal" title="Parameters" auto-close>
    <p-code-highlight :text="stringify(action.parameters)" lang="json" />
    <template #cancel>
      <p-button @click="closeParametersModal">
        Close
      </p-button>
    </template>
  </p-modal>

  <p-modal v-model:show-modal="showJobVariablesModal" title="Job Variables" auto-close>
    <p-code-highlight :text="stringify(action.jobVariables)" lang="json" />
    <template #cancel>
      <p-button @click="closeJobVariablesModal">
        Close
      </p-button>
    </template>
  </p-modal>
</template>

<script lang="ts" setup>
  import { AutomationActionRunDeployment } from '@/automations/types/actions'
  import DeploymentIconText from '@/components/DeploymentIconText.vue'
  import { useShowModal } from '@/compositions'
  import { stringify } from '@/utilities'

  defineOptions({
    inheritAttrs: false,
  })

  defineProps<{
    action: AutomationActionRunDeployment,
  }>()

  const { showModal: showParametersModal, open: openParametersModal, close: closeParametersModal } = useShowModal()
  const { showModal: showJobVariablesModal, open: openJobVariablesModal, close: closeJobVariablesModal } = useShowModal()
</script>

<style>
.automation-action-description-run-deployment { @apply
  flex
  flex-wrap
  gap-2
  items-center
}

.automation_action-description-run-deployment__deployment { @apply
  flex
  flex-wrap
  gap-1
  items-center
}
</style>