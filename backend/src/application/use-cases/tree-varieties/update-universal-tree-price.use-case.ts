import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { BadRequestError } from '../../../core/errors/app-error';

export interface UpdateUniversalTreePriceResult {
  updatedCount: number;
  universalPrice: number;
}

export class UpdateUniversalTreePriceUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}

  public async execute(price: number): Promise<UpdateUniversalTreePriceResult> {
    if (typeof price !== 'number' || price < 0 || isNaN(price)) {
      throw new BadRequestError('Price must be a valid non-negative number');
    }

    const updatedCount = await this.treeVarietyRepository.updateAllPrices(price);
    return {
      updatedCount,
      universalPrice: price,
    };
  }
}
