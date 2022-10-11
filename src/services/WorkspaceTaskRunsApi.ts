import { WorkspaceApi } from './WorkspaceApi'
import { StateResponse, State } from '@/models'
import { TaskRun } from '@/models/TaskRun'
import { TaskRunResponse } from '@/models/TaskRunResponse'
import { mapper } from '@/services/Mapper'
import { UnionFilters } from '@/types/UnionFilters'

export class WorkspaceTaskRunsApi extends WorkspaceApi {

  protected routePrefix = '/task_runs'

  public async getTaskRun(id: string): Promise<TaskRun> {
    const { data } = await this.get<TaskRunResponse>(`/${id}`)

    return mapper.map('TaskRunResponse', data, 'TaskRun')
  }

  public async getTaskRuns(filter: UnionFilters = {}): Promise<TaskRun[]> {
    const { data } = await this.post<TaskRunResponse[]>('/filter', filter)

    return mapper.map('TaskRunResponse', data, 'TaskRun')
  }

  public async getTaskRunsCount(filter: UnionFilters = {}): Promise<number> {
    const { data } = await this.post<number>('/count', filter)

    return data
  }

  public setTaskRunState(id: string, body: any): Promise<State> {
    return this.post<StateResponse>(`/${id}/set_state`, body)
      .then(({ data }) => mapper.map('StateResponse', data, 'State'))
  }

  public deleteTaskRun(taskRunId: string): Promise<void> {
    return this.delete(`/${taskRunId}`)
  }
}