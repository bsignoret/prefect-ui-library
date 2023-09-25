import { SavedSearch, SavedSearchFilter } from '@/models/SavedSearch'
import { prefectStateNamesWithoutScheduled } from '@/types/states'
import { asArray, isSame } from '@/utilities/arrays'
import { formatDateTimeNumeric } from '@/utilities/dates'
import { dateFunctions } from '@/utilities/timezone'

export function isSameFilter(filterA: SavedSearchFilter, filterB: SavedSearchFilter): boolean {
  if (!isSame(asArray(filterA.state), asArray(filterB.state))) {
    return false
  }

  if (!isSame(asArray(filterA.flow), asArray(filterB.flow))) {
    return false
  }

  if (!isSame(asArray(filterA.tag), asArray(filterB.tag))) {
    return false
  }

  if (!isSame(asArray(filterA.deployment), asArray(filterB.deployment))) {
    return false
  }

  if (!isSame(asArray(filterA.workPool), asArray(filterB.workPool))) {
    return false
  }

  return true
}

export function isEmptyFilter(filter: SavedSearchFilter): boolean {
  const emptyFilters = { state: [], flow: [], deployment: [], workPool: [], tag: [] } satisfies SavedSearchFilter
  return isSameFilter(filter, emptyFilters) && filter.startDate === undefined && filter.endDate === undefined
}

export const oneWeekFilter: SavedSearchFilter = {
  startDate: formatDateTimeNumeric(dateFunctions.subDays(dateFunctions.startOfToday(), 7)),
  endDate: formatDateTimeNumeric(dateFunctions.addDays(dateFunctions.endOfToday(), 1)),
  state: [],
  flow: [],
  tag: [],
  deployment: [],
  workPool: [],
}

export const noScheduleFilter: SavedSearchFilter = {
  state: prefectStateNamesWithoutScheduled.slice(),
  flow: [],
  tag: [],
  deployment: [],
  workPool: [],
  startDate: formatDateTimeNumeric(dateFunctions.subDays(dateFunctions.startOfToday(), 7)),
  endDate: formatDateTimeNumeric(dateFunctions.addDays(dateFunctions.endOfToday(), 1)),
}

export const customSavedSearch = new SavedSearch({
  id: null,
  name: 'Custom',
  filters: {},
})

export const oneWeekSavedSearch = new SavedSearch({
  id: null,
  name: 'Past week',
  filters: oneWeekFilter,
})

export const excludeScheduledSavedSearch = new SavedSearch({
  id: null,
  name: 'Hide scheduled runs',
  filters: noScheduleFilter,
})

export const unsavedPartialSearch = {
  id: null,
  name: 'Unsaved',
}

export const systemDefaultSavedSearch = oneWeekSavedSearch

export const systemSavedSearches = [
  customSavedSearch,
  oneWeekSavedSearch,
  excludeScheduledSavedSearch,
]
