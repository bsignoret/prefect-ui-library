import { FlowRun } from '@/models/FlowRun'
import { MockFunction } from '@/services/Mocker'
import { random } from '@/utilities/math'

export const randomFlowRun: MockFunction<FlowRun, [Partial<FlowRun>?]> = function(overrides = {}) {
  const state = this.create('state')
  return new FlowRun({
    id: this.create('id'),
    flowId: this.create('id'),
    deploymentId: random() > 0.7 ? this.create('id') : null,
    flowVersion: this.create('string'),
    idempotencyKey: this.create('string'),
    expectedStartTime: this.create('date'),
    nextScheduledStartTime: this.create('string'),
    parameters: {},
    autoScheduled: this.create('boolean'),
    context: {},
    empiricalConfig: {},
    empiricalPolicy: {},
    estimatedRunTime: this.create('number'),
    estimatedStartTimeDelta: this.create('number'),
    totalRunTime: this.create('number'),
    startTime: this.create('date'),
    endTime: this.create('date'),
    name: this.create('runName'),
    parentTaskRunId: random() > 0.9 ? this.create('id') : null,
    stateId: state.id,
    stateType: state.type,
    state: state,
    tags: this.createMany('noun', this.create('number', [0, 10])),
    runCount: this.create('number'),
    created: this.create('date'),
    updated: this.create('date'),
    ...overrides,
  })
}