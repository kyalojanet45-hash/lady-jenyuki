'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  pastryType: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  user?: {
    email: string;
  };
  baker?: {
    firstName: string;
    lastName: string;
    businessName?: string;
    phone?: string;
  };
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'placed' | 'received'>('placed');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, viewType]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?type=${viewType}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const canViewReceived = session.user?.role === 'BAKER';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">
                {viewType === 'placed' ? 'Orders you have placed' : 'Orders received for your bakery'}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* View Toggle (for bakers) */}
        {canViewReceived && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setViewType('placed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'placed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Orders I Placed
            </button>
            <button
              onClick={() => setViewType('received')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'received'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Orders I Received
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {order.pastryType}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Quantity:</strong> {order.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Order Date:</strong>{' '}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {viewType === 'placed' && order.baker && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                          <strong>Baker:</strong>{' '}
                          {order.baker.businessName || `${order.baker.firstName} ${order.baker.lastName}`}
                        </p>
                        {order.baker.phone && (
                          <p className="text-sm text-gray-600">
                            <strong>Contact:</strong> {order.baker.phone}
                          </p>
                        )}
                      </div>
                    )}

                    {viewType === 'received' && order.user && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                          <strong>Customer:</strong> {order.user.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <div className="text-2xl font-bold text-amber-600">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
