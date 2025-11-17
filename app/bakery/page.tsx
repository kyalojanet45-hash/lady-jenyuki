'use client';

import { useState,useEffect } from 'react';
import BakerCard from '@/components/Bakery/BakerCard';
import { bakers } from '@/data/bakersData';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Baker {
  id: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessAddress?: string;
  bio?: string;
  phone?: string;
  specialties: string[];
  photos: string[];
  user: {
    email: string;
  };
  education: Array<{
    universityName: string;
    courseName: string;
    graduationYear: string;
  }>;
}

export default function BakeryHome() {
    const { data: session } = useSession();
    const [bakers, setBakers] = useState<Baker[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBaker, setSelectedBaker] = useState<Baker | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderForm, setOrderForm] = useState({
      pastryType: '',
      quantity: 1,
      totalAmount: 0,
    });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  // const specialties = ['all', ...Array.from(new Set(bakers.map(b => b.specialty)))];
  // const filteredBakers = bakers.filter(baker => {
  //   const matchesSearch = 
  //     baker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     baker.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     baker.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
  //   const matchesSpecialty = 
  //     selectedSpecialty === 'all' || baker.specialty === selectedSpecialty;

  //   return matchesSearch && matchesSpecialty;
  // });
  const filteredBakers = []
    useEffect(() => {
      fetchBakers();
    }, []);
  
    const fetchBakers = async () => {
      try {
        const response = await fetch('/api/bakers');
        const data = await response.json();
        setBakers(data.bakers || []);
      } catch (error) {
        console.error('Error fetching bakers:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const openOrderModal = (baker: Baker) => {
      setSelectedBaker(baker);
      setShowOrderModal(true);
      setOrderForm({
        pastryType: '',
        quantity: 1,
        totalAmount: 0,
      });
    };
  
    const handleOrderSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!session) {
        alert('Please sign in to place an order');
        return;
      }
  
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bakerId: selectedBaker?.id,
            pastryType: orderForm.pastryType,
            quantity: orderForm.quantity,
            totalAmount: orderForm.totalAmount,
          }),
        });
  
        if (response.ok) {
          alert('Order placed successfully!');
          setShowOrderModal(false);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to place order');
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order');
      }
    };
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading bakers...</div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Lady Jenyuki
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-amber-100">
              Discover Local Master Bakers & Their Creations
            </p>
            <p className="text-lg text-amber-50 max-w-2xl mx-auto">
              Connect with talented bakers in your area. From sourdough to wedding cakes, find the perfect artisan for your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, business, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Specialty Filter */}
            <div className="md:w-64">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
              >
                {/* {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))} */}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
          {/* Showing <span className="font-semibold text-amber-600">{filteredBakers.length}</span> baker{filteredBakers.length !== 1 ? 's' : ''} */}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{bakers.length}+</div>
            <div className="text-gray-600">Master Bakers</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">2+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
        </div>
      </div>

      {/* Bakers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {bakers?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bakers?.map(baker => (
              <BakerCard key={baker.id} baker={baker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bakers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Are You a Baker?</h2>
          <p className="text-xl mb-8 text-amber-50">Join our marketplace and showcase your creations to thousands of customers</p>
          <button as=""className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-colors shadow-lg">
            Become a Vendor
          </button>
        </div>
      </div>
    </div>
  );
}
