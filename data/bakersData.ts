import { Baker, Product } from '@/types/bakery';

export const bakers: Baker[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    businessName: 'Sweet Maria\'s Artisan Bakery',
    specialty: 'French Pastries & Croissants',
    description: 'Trained in Paris, I bring authentic French baking techniques to create buttery, flaky pastries that transport you to a Parisian café.',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 234,
    location: 'Downtown, Seattle',
    contact: {
      phone: '+1 (206) 555-0123',
      email: 'maria@sweetmarias.com',
      website: 'www.sweetmarias.com',
      social: {
        instagram: '@sweetmarias',
        facebook: 'sweetmariasbakery',
      }
    },
    yearsOfExperience: 15,
    certifications: ['Le Cordon Bleu Paris', 'Master Pastry Chef']
  },
  {
    id: '2',
    name: 'James Chen',
    businessName: 'Chen\'s Sourdough House',
    specialty: 'Artisan Sourdough Bread',
    description: 'Specializing in naturally fermented sourdough breads using organic flour and traditional methods passed down through generations.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 189,
    location: 'Capitol Hill, Seattle',
    contact: {
      phone: '+1 (206) 555-0456',
      email: 'james@chenssourdough.com',
      website: 'www.chenssourdough.com',
      social: {
        instagram: '@chenssourdough',
        twitter: 'chenssourdough',
      }
    },
    yearsOfExperience: 12,
    certifications: ['Certified Artisan Baker', 'Organic Baking Specialist']
  },
  {
    id: '3',
    name: 'Aisha Patel',
    businessName: 'Aisha\'s Cake Studio',
    specialty: 'Custom Wedding & Event Cakes',
    description: 'Creating edible masterpieces for your special occasions. Each cake is a unique work of art, combining stunning design with delicious flavors.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&h=400&fit=crop',
    rating: 5.0,
    reviewCount: 312,
    location: 'Bellevue, WA',
    contact: {
      phone: '+1 (425) 555-0789',
      email: 'aisha@aishascakes.com',
      website: 'www.aishascakestudio.com',
      social: {
        instagram: '@aishascakestudio',
        facebook: 'aishascakestudio',
        twitter: 'aishascakes',
      }
    },
    yearsOfExperience: 10,
    certifications: ['Wilton Master Cake Decorator', 'Sugar Art Specialist']
  },
  {
    id: '4',
    name: 'Lucas Bergström',
    businessName: 'Nordic Bakes',
    specialty: 'Scandinavian Pastries',
    description: 'Bringing the flavors of Scandinavia to your table with traditional cinnamon buns, cardamom breads, and seasonal specialties.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    location: 'Fremont, Seattle',
    contact: {
      phone: '+1 (206) 555-0321',
      email: 'lucas@nordicbakes.com',
      website: 'www.nordicbakes.com',
      social: {
        instagram: '@nordicbakes',
        facebook: 'nordicbakes',
      }
    },
    yearsOfExperience: 8,
    certifications: ['Swedish Baking Institute']
  },
  {
    id: '5',
    name: 'Sophie Laurent',
    businessName: 'Macarons by Sophie',
    specialty: 'French Macarons & Petit Fours',
    description: 'Delicate, colorful macarons in classic and innovative flavors. Each batch is handcrafted with precision and love.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 278,
    location: 'Queen Anne, Seattle',
    contact: {
      phone: '+1 (206) 555-0654',
      email: 'sophie@macaronsbysophie.com',
      website: 'www.macaronsbysophie.com',
      social: {
        instagram: '@macaronsbysophie',
        facebook: 'macaronsbysophie',
      }
    },
    yearsOfExperience: 7,
    certifications: ['French Pastry Diploma', 'Macaron Specialist']
  },
  {
    id: '6',
    name: 'David Thompson',
    businessName: 'Rustic Oven Bakery',
    specialty: 'Artisan Breads & Rolls',
    description: 'Wood-fired oven baked breads with a perfect crust and soft interior. Using locally sourced ingredients for the best flavor.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 201,
    location: 'Ballard, Seattle',
    contact: {
      phone: '+1 (206) 555-0987',
      email: 'david@rusticoven.com',
      website: 'www.rusticovenbakery.com',
      social: {
        instagram: '@rusticoven',
        twitter: 'rusticoven',
      }
    },
    yearsOfExperience: 20,
    certifications: ['Master Baker', 'Wood-Fire Baking Expert']
  }
];

export const products: Product[] = [
  // Maria's products
  {
    id: 'p1',
    bakerId: '1',
    name: 'Classic Butter Croissant',
    description: 'Flaky, buttery perfection with 27 layers',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
    category: 'pastry',
    available: true
  },
  {
    id: 'p2',
    bakerId: '1',
    name: 'Pain au Chocolat',
    description: 'Croissant dough with premium dark chocolate',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=400&h=300&fit=crop',
    category: 'pastry',
    available: true
  },
  // James's products
  {
    id: 'p3',
    bakerId: '2',
    name: 'Classic Sourdough Loaf',
    description: 'Traditional sourdough with a crispy crust',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop',
    category: 'bread',
    available: true
  },
  {
    id: 'p4',
    bakerId: '2',
    name: 'Whole Wheat Sourdough',
    description: 'Hearty whole grain sourdough',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop',
    category: 'bread',
    available: true
  },
  // Aisha's products
  {
    id: 'p5',
    bakerId: '3',
    name: 'Custom Wedding Cake',
    description: 'Bespoke multi-tier wedding cake',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
    category: 'cake',
    available: true
  },
  {
    id: 'p6',
    bakerId: '3',
    name: 'Birthday Celebration Cake',
    description: 'Custom designed birthday cake',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop',
    category: 'cake',
    available: true
  },
];
