import { TreeInstance, TreeHealthStatus } from '../entities/tree-instance.entity';
import { Nullable } from '../../shared/types';

export interface TreeInstanceFilter {
  reserve?: string;
  healthStatus?: TreeHealthStatus | string;
  orderRef?: string;
  search?: string;
  isActive?: boolean;
}

export interface ITreeInstanceRepository {
  findById(id: string): Promise<Nullable<TreeInstance>>;
  findByTag(treeTag: string): Promise<Nullable<TreeInstance>>;
  findByOrderRef(orderRef: string): Promise<TreeInstance[]>;
  findAll(filter?: TreeInstanceFilter, limit?: number, skip?: number): Promise<TreeInstance[]>;
  count(filter?: TreeInstanceFilter): Promise<number>;
  save(treeInstance: TreeInstance): Promise<TreeInstance>;
  update(treeInstance: TreeInstance): Promise<TreeInstance>;
  delete(id: string): Promise<boolean>;
}
