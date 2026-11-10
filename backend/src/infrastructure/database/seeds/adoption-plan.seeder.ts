import { AdoptionPlanModel } from '../models/adoption-plan.model';
import { OccasionDedication } from '../../../core/entities/adoption-plan.entity';

export interface SeedPlan {
  planLabel: string;
  icon: string;
  price: number;
  priceModifier: number;
  description: string;
  features: string[];
  occasionDedications: OccasionDedication[];
  badge: string;
  activeCount: number;
  isActive: boolean;
}

export const SEED_ADOPTION_PLANS: SeedPlan[] = [
  {
    planLabel: '10 Trees Retail Plan',
    icon: '🌱',
    price: 25000,
    priceModifier: 25000,
    description: '10 dedicated living legacy trees in our flagship bio-reserve with lifelong custody, geotagging, and plantation visit access. (AED 1,000 • $300)',
    features: [
      '10 Dedicated Native Trees',
      'Digital Certificate Deed of Custody',
      'Individual GPS Geotagging & Telemetry',
      'Complimentary Plantation Visit Pass',
      'Annual Growth & Biomass Reports',
    ],
    occasionDedications: ['birthday', 'anniversary', 'marriage', 'general', 'other'],
    badge: 'Flagship Retail',
    activeCount: 142,
    isActive: true,
  },
  {
    planLabel: '25 Trees Family Grove',
    icon: '🌳',
    price: 50000,
    priceModifier: 50000,
    description: 'A cohesive 25-tree living grove dedicated to your family name with engraved physical plaque and priority arborist tours.',
    features: [
      '25 Dedicated Native Reserve Trees',
      'Physical Family Grove Plaque at Reserve',
      'Multi-Name Official Digital Deed',
      'Priority Plantation Walk & Harvest Access',
      'Quarterly High-Res Canopy Telemetry',
    ],
    occasionDedications: ['memorial', 'marriage', 'anniversary', 'other', 'general'],
    badge: 'Family Legacy',
    activeCount: 68,
    isActive: true,
  },
  {
    planLabel: '50 Trees Heritage Estate',
    icon: '🌲',
    price: 95000,
    priceModifier: 95000,
    description: 'A 50-tree ecological sanctuary honoring your family or institution with high-resolution aerial mapping and VIP retreat passes.',
    features: [
      '50 Dedicated Native Biome Trees',
      'Custom Engraved Stone Plaque at Forest',
      'VIP Plantation Retreat & Wellness Passes',
      'Comprehensive Carbon & Biomass Telemetry',
      'Seasonal Organic Harvest Box Delivery',
    ],
    occasionDedications: ['memorial', 'corporate', 'general', 'other'],
    badge: 'Estate Sanctuary',
    activeCount: 34,
    isActive: true,
  },
  {
    planLabel: '100 Trees Corporate Plantation',
    icon: '🏢',
    price: 180000,
    priceModifier: 180000,
    description: 'High-impact corporate environmental stewardship, ESG/CSR audit compliance, co-branded deeds, and employee green engagement.',
    features: [
      '100 Dedicated Native Bio-Diverse Trees',
      'ESG & CSR-Compatible Audit Compliance Ledger',
      'Co-Branded Digital Certificates for Teams & Clients',
      'Corporate Milestone Dedication Plaque',
      'Employee Engagement & Forest Visit Retreats',
    ],
    occasionDedications: ['corporate', 'general'],
    badge: 'Corporate & ESG',
    activeCount: 19,
    isActive: true,
  },
  {
    planLabel: '1 Tree Individual Dedication',
    icon: '🌿',
    price: 2500,
    priceModifier: 2500,
    description: 'Dedicate a single living tree for a birthday, wedding, memorial, or personal milestone with lifelong custody and digital deed.',
    features: [
      '1 Dedicated Native Living Tree',
      'Personalized Occasion Certificate & Deed',
      'Precise GPS Coordinates & Live Map Tracking',
      'Annual Field Growth Updates & Photos',
      'Single-Time Lifetime Custody (Zero Renewal Fees)',
    ],
    occasionDedications: ['birthday', 'student', 'marriage', 'memorial', 'other', 'general'],
    badge: 'Milestone Dedication',
    activeCount: 215,
    isActive: true,
  },
];

export async function seedAdoptionPlansIfEmpty(): Promise<void> {
  try {
    for (const planData of SEED_ADOPTION_PLANS) {
      const existing = await AdoptionPlanModel.findOne({ planLabel: planData.planLabel });
      if (!existing) {
        await AdoptionPlanModel.create(planData);
        console.log(`🌱 Seeded adoption plan: ${planData.planLabel} (₹${planData.price})`);
      } else {
        await AdoptionPlanModel.updateOne(
          { planLabel: planData.planLabel },
          { $set: { price: planData.price, priceModifier: planData.price, features: planData.features, badge: planData.badge, description: planData.description } }
        );
      }
    }
  } catch (err) {
    console.warn('Notice: Could not complete adoption plans seeding:', err);
  }
}
