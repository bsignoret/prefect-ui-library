import { WorkspaceApi } from './WorkspaceApi'
import { ConcurrencyLimitResponse } from '@/models/api/ConcurrencyLimitResponse'
import { ConcurrencyLimit } from '@/models/ConcurrencyLimit'
import { ConcurrencyLimitCreate } from '@/models/ConcurrencyLimitCreate'
import { ConcurrencyLimitsFilter } from '@/models/ConcurrencyLimitsFilter'
import { mapper } from '@/services/Mapper'

export interface IWorkspaceConcurrencyLimitsApi {
  getConcurrencyLimit: (concurrencyLimitId: string) => Promise<ConcurrencyLimit>,
  getConcurrencyLimits: (filter: ConcurrencyLimitsFilter) => Promise<ConcurrencyLimit[]>,
  createConcurrencyLimit: (ConcurrencyLimit: ConcurrencyLimitCreate) => Promise<ConcurrencyLimit>,
  getConcurrencyLimitByTag: (tag: string) => Promise<ConcurrencyLimit>,
  deleteConcurrencyLimit: (concurrencyLimitId: string) => Promise<void>,
  deleteConcurrencyLimitByTag: (tag: string) => Promise<void>,
}


export class WorkspaceConcurrencyLimitsApi extends WorkspaceApi {

  protected routePrefix = '/concurrency_limits'

  public async getConcurrencyLimits(filter: ConcurrencyLimitsFilter = {}): Promise<ConcurrencyLimit[]> {
    const { data } = await this.post<ConcurrencyLimitResponse[]>('/filter', filter)
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public async getConcurrencyLimit(id: string): Promise<ConcurrencyLimit> {
    const { data } = await this.get<ConcurrencyLimitResponse>(`/${id}`)
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public async getConcurrencyLimitByTag(tag: string): Promise<ConcurrencyLimit> {
    const { data } = await this.get<ConcurrencyLimitResponse>(`/tag/${tag}`)
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public async createConcurrencyLimit(limit: ConcurrencyLimitCreate): Promise<ConcurrencyLimit> {
    const { data } = await this.post<ConcurrencyLimitResponse>('/', mapper.map('ConcurrencyLimitCreate', limit, 'ConcurrencyLimitCreateRequest'))
    return mapper.map('ConcurrencyLimitResponse', data, 'ConcurrencyLimit')
  }

  public deleteConcurrencyLimit(id: string): Promise<void> {
    return this.delete(`/${id}`)
  }

  public deleteConcurrencyLimitByTag(tag: string): Promise<void> {
    return this.delete(`/tag/${tag}`)
  }

}

