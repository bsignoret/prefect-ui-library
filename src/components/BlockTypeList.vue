<template>
  <div class="block-type-list">
    <div class="block-type-list__filters">
      <ResultsCount label="Block" :count="filteredBlockTypes.length" class="block-type-list__results" />
      <SearchInput v-model="searchTerm" class="block-type-list__search" placeholder="Search blocks" />
      <BlockSchemaCapabilitySelect v-model:selected="selectedCapability" class="block-type-list__capability" />
    </div>

    <div class="block-type-list__types">
      <template v-for="blockType in filteredBlockTypes" :key="blockType.id">
        <BlockTypeCardPreview :block-type="blockType">
          <template #actions>
            <p-button v-if="useEmit" icon-append="PlusIcon" class="block-type-list__add" @click="emit('add', blockType)">
              Add
            </p-button>
            <p-link v-else :to="routes.blockCreate(blockType.slug)">
              <p-button icon-append="PlusIcon" class="block-type-list__add">
                Add
              </p-button>
            </p-link>
          </template>
        </BlockTypeCardPreview>
      </template>
    </div>

    <PEmptyResults v-if="empty">
      <template #message>
        No blocks
      </template>
      <template #actions>
        <p-button size="sm" @click="clear">
          Clear Filters
        </p-button>
      </template>
    </PEmptyResults>
  </div>
</template>

<script lang="ts" setup>
  import { PEmptyResults } from '@prefecthq/prefect-design'
  import { computed, ref } from 'vue'
  import BlockSchemaCapabilitySelect from '@/components/BlockSchemaCapabilitySelect.vue'
  import BlockTypeCardPreview from '@/components/BlockTypeCardPreview.vue'
  import ResultsCount from '@/components/ResultsCount.vue'
  import SearchInput from '@/components/SearchInput.vue'
  import { useWorkspaceRoutes } from '@/compositions'
  import { BlockType } from '@/models/BlockType'

  const props = defineProps<{
    blockTypes: BlockType[],
    capability: string | null,
    useEmit?: boolean,
  }>()

  const emit = defineEmits<{
    (event: 'update:capability', value: string | null): void,
    (event: 'add', blockType: BlockType): void,
  }>()

  const routes = useWorkspaceRoutes()

  const searchTerm = ref('')
  const selectedCapability = computed({
    get() {
      return props.capability
    },
    set(value: string | null) {
      emit('update:capability', value)
    },
  })

  const filteredBlockTypes = computed(() => props.blockTypes.filter(filterBlockType))
  const filtered = computed(() => searchTerm.value.length || props.capability !== null)
  const empty = computed(() => filtered.value && filteredBlockTypes.value.length === 0)

  function filterBlockType({ name }: BlockType): boolean {
    return name.toLowerCase().includes(searchTerm.value.toLowerCase())
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

.block-type-list__add { @apply
  w-full
}
</style>