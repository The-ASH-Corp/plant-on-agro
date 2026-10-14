import {
  ITreeVarietyRepository,
  TreeVarietyFilter,
} from '../../../core/interfaces/tree-variety.repository.interface';
import {
  TreeVarietyResponseDto,
  TreeVarietyResponseMapper,
} from '../../dto/tree-variety-response.dto';

export interface GetTreeVarietiesQuery {
  category?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export interface GetTreeVarietiesResult {
  items: TreeVarietyResponseDto[];
  total: number;
  limit: number;
  skip: number;
}

export class GetTreeVarietiesUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}

  public async execute(query: GetTreeVarietiesQuery = {}): Promise<GetTreeVarietiesResult> {
    const limit = query.limit ?? 50;
    const skip = query.skip ?? 0;

    const filter: TreeVarietyFilter = {
      category: query.category,
      search: query.search,
      isActive: query.isActive,
    };

    const [trees, total] = await Promise.all([
      this.treeVarietyRepository.findAll(filter, limit, skip),
      this.treeVarietyRepository.count(filter),
    ]);

    return {
      items: trees.map(TreeVarietyResponseMapper.toDto),
      total,
      limit,
      skip,
    };
  }
}
