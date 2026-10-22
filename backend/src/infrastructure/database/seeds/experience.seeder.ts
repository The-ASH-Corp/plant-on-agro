import { ExperienceModel } from '../models/experience.model';

const SEED_EXPERIENCES = [
  {
    title: 'Sacred Forest Canopy Walk & Arborist Trail',
    slug: 'sacred-forest-canopy-walk',
    category: 'Forest Walk',
    tagline: 'Connect deeply with living indigenous trees guided by expert botanists.',
    description:
      'Immerse yourself in Kerala’s 20-acre bio-diverse sacred forest corridor. Walk beneath dense native canopies, locate your dedicated adopted trees using GPS tags, learn medicinal plant lore from resident arborists, and practice mindful forest bathing (Shinrin-yoku).',
    location: 'Flagship Living Forest — Wayanad, Kerala',
    duration: '3 Hours',
    price: 0, // Complimentary for tree adopters / guardians
    included: [
      'Dedicated Arborist Guided Trail',
      'Locate & Tag Your Adopted Trees',
      'Wild Forest Herbal Infusions',
      'Shinrin-yoku Forest Bathing Session',
      'High-Resolution Digital Photo Album',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&auto=format&fit=crop&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    maxGroupSize: 12,
    rating: 4.95,
    reviewsCount: 38,
    isActive: true,
  },
  {
    title: 'Wayanad Agro-Harvest & Farm-to-Table Experience',
    slug: 'wayanad-agro-harvest-farm-to-table',
    category: 'Harvesting',
    tagline: 'Hands-on organic harvesting, nursery propagation & authentic Malabar feast.',
    description:
      'Discover the productive agroforestry layer of PlantOn Agro. Pick seasonal organic mangoes, jackfruits, and black pepper directly from living branches. Learn sapling grafting techniques in the master nursery, and savor a 5-course farm-to-table organic lunch cooked over traditional hearths.',
    location: 'PlantOn Agro Plantation — Wayanad, Kerala',
    duration: '5 Hours',
    price: 1200,
    included: [
      'Handcrafted Woven Harvest Basket',
      'Seasonal Fruit & Pepper Picking',
      'Nursery Grafting Masterclass',
      '5-Course Organic Malabar Farm Lunch',
      'Gift Sapling to Take Home',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d691026cb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&auto=format&fit=crop&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&auto=format&fit=crop&q=80',
    maxGroupSize: 15,
    rating: 4.9,
    reviewsCount: 42,
    isActive: true,
  },
  {
    title: 'Ayurvedic Nature Healing, Yoga & Herbal Ice Bath',
    slug: 'ayurvedic-forest-healing-yoga-ice-bath',
    category: 'Wellness',
    tagline: 'Ancient Kerala wellness, steam sauna & contrast therapy overlooking the forest.',
    description:
      'In partnership with RAC Realty’s adjoining 10-acre wellness destination, experience authentic Ayurveda rooted in forest herbs. Enjoy a 60-minute rejuvenating Abhyanga oil massage, open-air pavilion yoga, cedarwood steam sauna, and guided contrast ice bath therapy for deep vitality.',
    location: 'RAC Realty Wellness Destination — Kerala',
    duration: '4 Hours',
    price: 2500,
    included: [
      '60-Min Traditional Abhyanga Massage',
      'Open-Air Forest Yoga & Pranayama',
      'Cedarwood Herbal Steam & Sauna',
      'Contrast Ice Bath Therapy Experience',
      'Ayurvedic Herbal Elixirs & Teas',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
    maxGroupSize: 10,
    rating: 4.98,
    reviewsCount: 56,
    isActive: true,
  },
  {
    title: 'Heritage Plantation Stay & Pottery Workshop',
    slug: 'heritage-plantation-stay-pottery',
    category: 'Heritage Stay',
    tagline: 'Timeless Kerala architecture, artificial ponds, pottery & farm animals.',
    description:
      'Escape to RAC Realty’s heritage farm retreat bordering the PlantOn forest. Sleep in authentic Kerala wooden architecture with verandas overlooking lotus ponds. Get your hands muddy in artisanal wheel pottery, interact with friendly native farm animals, and unwind under starlit canopies.',
    location: 'RAC Realty Heritage Estate — Wayanad, Kerala',
    duration: '2 Days / 1 Night',
    price: 6500,
    included: [
      'Overnight Heritage Villa Suite Stay',
      'Artisanal Clay Pottery Masterclass',
      'Farm Animal Interaction & Feeding',
      'Lotus Pond Kayak / Paddle Access',
      'Full Board Farm-to-Table Meals',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    maxGroupSize: 8,
    rating: 4.97,
    reviewsCount: 29,
    isActive: true,
  },
  {
    title: 'ATV Rainforest Mud Trail & Safari',
    slug: 'atv-rainforest-mud-trail-safari',
    category: 'Adventure',
    tagline: 'Thrilling all-terrain expedition through perimeter jungle trails and mud tracks.',
    description:
      'Power through scenic plantation tracks, water splashes, and rugged forest perimeter ridges on all-terrain quads. Guided by safety marshals, you will navigate winding curves, cross bamboo bridges, and witness panoramic views of the Western Ghats mountain backdrop.',
    location: 'RAC Adventure Park — Wayanad, Kerala',
    duration: '2 Hours',
    price: 1800,
    included: [
      'High-Performance Polaris ATV Vehicle',
      'Full Certified Safety Gear & Helmet',
      'Lead Marshall & Navigator Briefing',
      'Mud Obstacle Track Experience',
      'Action Camera 4K Video Clip',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80',
    maxGroupSize: 8,
    rating: 4.88,
    reviewsCount: 31,
    isActive: true,
  },
];

export async function seedExperiencesIfEmpty(): Promise<void> {
  try {
    const count = await ExperienceModel.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial Flagship PlantOn & RAC Realty Experiences...');
      await ExperienceModel.insertMany(SEED_EXPERIENCES);
      console.log(`✅ Seeded ${SEED_EXPERIENCES.length} experiences with multi-image galleries.`);
    }
  } catch (error) {
    console.error('⚠️ Error seeding experiences:', error);
  }
}
