import { TreeVariety, TreeCategory } from '../entities/tree-variety.entity';
import { Nullable } from '../../shared/types';

export interface TreeVarietyFilter {
  category?: TreeCategory | string;
  search?: string;
  isActive?: boolean;
}

export interface ITreeVarietyRepository {
  findById(id: string): Promise<Nullable<TreeVariety>>;
  findAll(filter?: TreeVarietyFilter, limit?: number, skip?: number): Promise<TreeVariety[]>;
  count(filter?: TreeVarietyFilter): Promise<number>;
  save(tree: TreeVariety): Promise<TreeVariety>;
  update(tree: TreeVariety): Promise<TreeVariety>;
  delete(id: string): Promise<boolean>;
}
