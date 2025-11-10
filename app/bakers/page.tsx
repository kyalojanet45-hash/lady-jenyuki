'use client';

import { useEffect, useState } from 'react';
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

export default function BakersPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Approved Bakers</h1>
              <p className="text-gray-600 mt-2">Browse and order from verified bakers</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Bakers Grid */}
        {bakers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No approved bakers available yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bakers.map((baker) => (
              <div key={baker.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Baker Image */}
                <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  {baker.photos && baker.photos.length > 0 ? (
                    <div className="text-6xl">🧁</div>
                  ) : (
                    <div className="text-6xl">👨‍🍳</div>
                  )}
                </div>

                {/* Baker Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {baker.businessName || `${baker.firstName} ${baker.lastName}`}
                  </h3>
                  
                  {baker.businessName && (
                    <p className="text-sm text-gray-600 mb-2">
                      by {baker.firstName} {baker.lastName}
                    </p>
                  )}

                  {baker.bio && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {baker.bio}
                    </p>
                  )}

                  {baker.businessAddress && (
                    <p className="text-xs text-gray-500 mb-3">
                      📍 {baker.businessAddress}
                    </p>
                  )}

                  {/* Specialties */}
                  {baker.specialties && baker.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {baker.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                        {baker.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{baker.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="mb-4 text-sm text-gray-600">
                    {baker.phone && <p>📞 {baker.phone}</p>}
                    <p>✉️ {baker.user.email}</p>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={() => openOrderModal(baker)}
                    className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedBaker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order from {selectedBaker.businessName || selectedBaker.firstName}
            </h2>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pastry Type
                </label>
                <input
                  type="text"
                  value={orderForm.pastryType}
                  onChange={(e) => setOrderForm({ ...orderForm, pastryType: e.target.value })}
                  required
                  placeholder="e.g., Croissant, Cake, Cookies"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                  required
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderForm.totalAmount}
                  onChange={(e) => setOrderForm({ ...orderForm, totalAmount: parseFloat(e.target.value) })}
                  required
                  className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
