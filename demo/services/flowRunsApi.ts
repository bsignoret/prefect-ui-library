import { createActions } from '@prefecthq/vue-compositions'
import { MockedApi } from './MockedApi'
import { GraphNode } from '@/models'
import { FlowRun } from '@/models/FlowRun'
import { RunHistory } from '@/models/RunHistory'
import { mocker } from '@/services'
import { UnionFilters, FlowRunsHistoryFilter } from '@/types/UnionFilters'

export class FlowRunsApi extends MockedApi {
  public getFlowRun(id: string): Promise<FlowRun> {
    return this.promise(mocker.create('flowRun', [{ id: id }]))
  }

  public getFlowRuns(filter: UnionFilters): Promise<FlowRun[]> {
    return this.promise(mocker.createMany('flowRun', 20))
  }

  public getFlowRunsCount(filter: UnionFilters): Promise<number> {
    return this.promise(mocker.create('number'))
  }

  public getFlowRunsHistory(filter: FlowRunsHistoryFilter): Promise<RunHistory[]> {
    return this.promise(mocker.createMany('flowRunHistory', 15))
  }

  public getFlowRunsGraph(id: string): Promise<GraphNode[]> {
    return this.promise(mocker.create('flowRunGraph', [{ size: mocker.create('number', [3, 10]), shape: 'fanOut', fanMultiplier: 2 }]))
  }

  public deleteFlowRun(id: string): Promise<void> {
    return this.void()
  }
}

export const flowRunsApi = createActions(new FlowRunsApi())