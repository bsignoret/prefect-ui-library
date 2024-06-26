<template>
  <p-content class="automation-action-run-deployment-parameters">
    <SchemaInputV2
      v-model:values="parameters"
      :schema="deployment.parameterOpenApiSchemaV2"
      :kinds="['none', 'json', 'jinja', 'workspace_variable']"
      :errors="errors"
    >
      <template #default="{ kind, setKind }">
        <div class="automation-action-run-deployment-parameters__header">
          <h3 class="deployment-form__heading">
            Parameters
          </h3>
          <p-icon-button-menu small>
            <p-overflow-menu-item v-if="kind !== 'none'" label="Use form input" @click="setKind('none')" />
            <p-overflow-menu-item v-if="kind !== 'json'" label="Use JSON input" @click="setKind('json')" />
            <p-overflow-menu-item v-if="kind !== 'jinja'" label="Use Jinja input" @click="setKind('jinja')" />
          </p-icon-button-menu>
        </div>
      </template>
    </SchemaInputV2>
  </p-content>
</template>

<script lang="ts" setup>
  import { ValidationRule, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { Deployment } from '@/models/Deployment'
  import { SchemaValuesV2, useSchemaValidationV2, SchemaInputV2 } from '@/schemas'
  import { isRecord } from '@/utilities/object'
  import { timeout } from '@/utilities/time'

  const props = defineProps<{
    deployment: Deployment,
    values: SchemaValuesV2 | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: SchemaValuesV2): void,
  }>()

  const parameters = computed({
    get() {
      if (isRecord(props.values)) {
        return props.values
      }

      return {}
    },
    set(values) {
      emit('update:values', values)
    },
  })

  const { errors, validate: validateParameters } = useSchemaValidationV2(() => props.deployment.parameterOpenApiSchemaV2, parameters)

  const isValidParameters: ValidationRule<SchemaValuesV2> = async (value, label, { signal, source, previousValue }) => {
    if (value === previousValue) {
      return
    }

    if (source === 'validator') {
      await timeout(5000, signal)
    }

    if (signal.aborted) {
      return
    }

    return await validateParameters()
  }

  useValidation(parameters, isValidParameters)
</script>

<style>
.automation-action-run-deployment-parameters__header { @apply
  flex
  items-center
  justify-between
}
</style>