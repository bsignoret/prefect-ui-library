<template>
  <div class="block-type-list">
    <div class="block-type-list__filters">
      <ResultsCount label="blocks" :count="filteredBlockTypes.length" class="block-type-list__results" />
      <SearchInput v-model="searchTerm" class="block-type-list__search" />
      <BlockSchemaCapabilitySelect v-model:selected="selectedCapability" class="block-type-list__capability" />
    </div>

    <div class="block-type-list__types">
      <template v-for="blockType in filteredBlockTypes" :key="blockType.id">
        <BlockTypeCard :block-type="blockType">
          <template #actions>
            <p-link :to="blockCatalogCreateRoute(blockType.name)" class="block-type-card__action">
              <p-button inset class="block-type-card__button">
                Add <p-icon icon="PlusIcon" />
              </p-button>
            </p-link>
          </template>
        </BlockTypeCard>
      </template>
    </div>

    <PEmptyResults v-if="empty">
      <template #message>
        No blocks
      </template>
      <template #actions>
        <p-button size="sm" secondary @click="clear">
          Clear Filters
        </p-button>
      </template>
    </PEmptyResults>
  </div>
</template>

<script lang="ts" setup>
  import { PEmptyResults } from '@prefecthq/prefect-design'
  import { computed, ref } from 'vue'
  import ResultsCount from './ResultsCount.vue'
  import BlockSchemaCapabilitySelect from '@/components/BlockSchemaCapabilitySelect.vue'
  import BlockTypeCard from '@/components/BlockTypeCard.vue'
  import SearchInput from '@/components/SearchInput.vue'
  import { BlockSchemaCapability } from '@/models'
  import { BlockType } from '@/models/BlockType'
  import { blockCatalogCreateRouteKey } from '@/router/routes'
  import { inject } from '@/utilities/inject'

  const props = defineProps<{
    blockTypes: BlockType[],
  }>()

  const blockCatalogCreateRoute = inject(blockCatalogCreateRouteKey)

  const searchTerm = ref('')
  const selectedCapability = ref<BlockSchemaCapability | null>(null)

  const filteredBlockTypes = computed(() => props.blockTypes.filter(filterBlockType))
  const empty = computed(() => props.blockTypes.length && filteredBlockTypes.value.length === 0)

  function filterBlockType({ name  }: BlockType): boolean {
    return `${name}`.toLowerCase().includes(searchTerm.value.toLowerCase())
  }

  function clear(): void {
    searchTerm.value = ''
    selectedCapability.value = null
  }
</script>

<style>
.block-type-list { @apply
  grid
  gap-4
}

.block-type-list__filters { @apply
  grid
  md:flex
  gap-2
  items-center
}

.block-type-list__filters {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "search"
                       "capability"
                       "results";
}

.block-type-list__results { @apply
  mt-2
  md:mt-0
  md:mr-auto
}

.block-type-list__results {
  grid-area: results;
}

.block-type-list__search {
  grid-area: search;
}

.block-type-list__capabilities {
  grid-area: capability;
}

.block-type-list__types { @apply
  grid
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-2
}
</style>