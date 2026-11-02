import { AdoptionPlanModel } from '../models/adoption-plan.model';
import { OccasionDedication } from '../../../core/entities/adoption-plan.entity';

interface SeedAdoptionPlan {
  planLabel: string;
  icon: string;
  priceModifier: number;
  description: string;
  features: string[];
  occasionDedications: OccasionDedication[];
  badge: string;
  activeCount: number;
  isActive: boolean;
}

export const SEED_ADOPTION_PLANS: SeedAdoptionPlan[] = [
  {
    planLabel: 'Birthday Plan',
    icon: '🎂',
    priceModifier: 0,
    description: 'Celebrate a special birthday with a living legacy tree that grows year after year.',
    features: [
      'Personalized Birthday Certificate',
      'GPS Geotagging & Tree Registry',
      'Annual Drone Growth Updates',
    ],
    occasionDedications: ['birthday'],
    badge: 'Popular',
    activeCount: 142,
    isActive: true,
  },
  {
    planLabel: 'Student Plan',
    icon: '🎓',
    priceModifier: 0,
    description: 'Empower students and schools with youth eco-adoption and green learning badges.',
    features: [
      'Student Eco-Champion Certificate',
      'Tree Biology & NDVI Telemetry',
      'Single-Time Lifetime Care',
    ],
    occasionDedications: ['student', 'general'],
    badge: 'Youth & Eco',
    activeCount: 98,
    isActive: true,
  },
  {
    planLabel: 'Marriage Plan',
    icon: '💍',
    priceModifier: 0,
    description: 'Commemorate a wedding, engagement, or marriage anniversary with rooted, enduring love.',
    features: [
      'Couples Commemorative Certificate',
      'Dual-Named Geotagged Deed',
      'Complimentary Forest Visit Access',
    ],
    occasionDedications: ['marriage', 'anniversary'],
    badge: 'Celebration',
    activeCount: 184,
    isActive: true,
  },
  {
    planLabel: 'Other Occasion',
    icon: '🌱',
    priceModifier: 0,
    description: 'Dedicate a tree in honor of a memorial, retirement, newborn baby, festival, or custom milestone.',
    features: [
      'Personalized Dedication Message',
      'Blockchain-Verified Digital Deed',
      'Full Lifetime Forest Protection',
    ],
    occasionDedications: ['other', 'general'],
    badge: 'Custom',
    activeCount: 76,
    isActive: true,
  },
];

export async function seedAdoptionPlansIfEmpty(): Promise<void> {
  try {
    for (const planData of SEED_ADOPTION_PLANS) {
      const existing = await AdoptionPlanModel.findOne({ planLabel: planData.planLabel });
      if (!existing) {
        await AdoptionPlanModel.create(planData);
        console.log(`🌱 Seeded adoption plan: ${planData.planLabel}`);
      }
    }
  } catch (err) {
    console.warn('Notice: Could not complete adoption plans seeding:', err);
  }
}
