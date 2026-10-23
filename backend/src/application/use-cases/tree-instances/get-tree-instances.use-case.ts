import {
  ITreeInstanceRepository,
  TreeInstanceFilter,
} from '../../../core/interfaces/tree-instance.repository.interface';
import {
  TreeInstanceResponseDto,
  TreeInstanceResponseMapper,
} from '../../dto/tree-instance-response.dto';

export interface GetTreeInstancesQuery {
  reserve?: string;
  healthStatus?: string;
  orderRef?: string;
  search?: string;
  adopterEmail?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export interface GetTreeInstancesResult {
  items: TreeInstanceResponseDto[];
  total: number;
  limit: number;
  skip: number;
}

export class GetTreeInstancesUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(query: GetTreeInstancesQuery = {}): Promise<GetTreeInstancesResult> {
    const limit = query.limit ?? 50;
    const skip = query.skip ?? 0;

    const filter: TreeInstanceFilter = {
      reserve: query.reserve,
      healthStatus: query.healthStatus,
      orderRef: query.orderRef,
      search: query.search,
      adopterEmail: query.adopterEmail,
      isActive: query.isActive,
    };

    const [instances, total] = await Promise.all([
      this.treeInstanceRepository.findAll(filter, limit, skip),
      this.treeInstanceRepository.count(filter),
    ]);

    return {
      items: instances.map(TreeInstanceResponseMapper.toDto),
      total,
      limit,
      skip,
    };
  }
}
