import { AdoptionPlan } from '../../../core/entities/adoption-plan.entity';
import { IAdoptionPlanDocument } from '../models/adoption-plan.model';

export class AdoptionPlanMapper {
  public static toDomain(doc: IAdoptionPlanDocument): AdoptionPlan {
    return new AdoptionPlan({
      id: doc._id ? String(doc._id) : undefined,
      planLabel: doc.planLabel,
      icon: doc.icon,
      price: (doc as any).price !== undefined ? (doc as any).price : doc.priceModifier,
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
      price: plan.price,
      priceModifier: plan.price,
      description: plan.description,
      features: plan.features,
      occasionDedications: plan.occasionDedications,
      badge: plan.badge,
      activeCount: plan.activeCount,
      isActive: plan.isActive,
    };
  }
}
