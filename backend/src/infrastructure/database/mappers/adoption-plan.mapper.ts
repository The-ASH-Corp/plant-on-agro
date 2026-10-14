import { AdoptionPlan } from '../../../core/entities/adoption-plan.entity';
import { IAdoptionPlanDocument } from '../models/adoption-plan.model';

export class AdoptionPlanMapper {
  public static toDomain(doc: IAdoptionPlanDocument): AdoptionPlan {
    return new AdoptionPlan({
      id: doc._id ? String(doc._id) : undefined,
      planLabel: doc.planLabel,
      icon: doc.icon,
      priceModifier: doc.priceModifier,
      description: doc.description,
      features: doc.features,
      occasionDedications: doc.occasionDedications,
      badge: doc.badge,
      activeCount: doc.activeCount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(plan: AdoptionPlan): Partial<IAdoptionPlanDocument> {
    return {
      planLabel: plan.planLabel,
      icon: plan.icon,
      priceModifier: plan.priceModifier,
      description: plan.description,
      features: plan.features,
      occasionDedications: plan.occasionDedications,
      badge: plan.badge,
      activeCount: plan.activeCount,
      isActive: plan.isActive,
    };
  }
}
