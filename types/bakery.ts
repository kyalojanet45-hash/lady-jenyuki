export interface Baker {
  id: string;
  name: string;
  businessName: string;
  specialty: string;
  description: string;
  photo: string;
  coverPhoto: string;
  rating: number;
  reviewCount: number;
  location: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  yearsOfExperience: number;
  certifications?: string[];
}

export interface Product {
  id: string;
  bakerId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'bread' | 'cake' | 'pastry' | 'cookie' | 'specialty';
  available: boolean;
}
