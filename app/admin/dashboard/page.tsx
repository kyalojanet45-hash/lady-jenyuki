'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  bakerStatus: string;
  user: {
    email: string;
    createdAt: string;
  };
  education: Array<{
    universityName: string;
    courseName: string;
    graduationYear: string;
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bakers, setBakers] = useState<Baker[]>([]);
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchBakers();
    }
  }, [status, session, filter]);

  const fetchBakers = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' 
        ? '/api/admin/bakers' 
        : `/api/admin/bakers?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setBakers(data.bakers || []);
    } catch (error) {
      console.error('Error fetching bakers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBakerStatus = async (bakerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bakers/${bakerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBakers();
      }
    } catch (error) {
      console.error('Error updating baker status:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-600 mt-2">Manage baker verifications</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bakers List */}
        <div className="space-y-4">
          {bakers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No bakers found for this filter
            </div>
          ) : (
            bakers.map((baker) => (
              <div key={baker.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {baker.firstName} {baker.lastName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          baker.bakerStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : baker.bakerStatus === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {baker.bakerStatus}
                      </span>
                    </div>

                    {baker.businessName && (
                      <p className="text-lg text-gray-700 mb-1">
                        <strong>Business:</strong> {baker.businessName}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Email:</strong> {baker.user.email}
                    </p>

                    {baker.phone && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Phone:</strong> {baker.phone}
                      </p>
                    )}

                    {baker.businessAddress && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Address:</strong> {baker.businessAddress}
                      </p>
                    )}

                    {baker.bio && (
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Bio:</strong> {baker.bio}
                      </p>
                    )}

                    {baker.specialties && baker.specialties.length > 0 && (
                      <div className="mb-3">
                        <strong className="text-sm text-gray-700">Specialties:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {baker.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {baker.education && baker.education.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <strong className="text-sm text-gray-700">Education:</strong>
                        {baker.education.map((edu, idx) => (
                          <p key={idx} className="text-sm text-gray-600 mt-1">
                            {edu.courseName} - {edu.universityName} ({edu.graduationYear})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {baker.bakerStatus !== 'APPROVED' && (
                      <button
                        onClick={() => updateBakerStatus(baker.id, 'APPROVED')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                      >
                        Approve
                      </button>
                    )}
                    {baker.bakerStatus !== 'REJECTED' && (
                      <button
                        onClick={() => updateBakerStatus(baker.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                      >
                        Reject
                      </button>
                    )}
                    {baker.bakerStatus !== 'PENDING' && (
                      <button
                        onClick={() => updateBakerStatus(baker.id, 'PENDING')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm"
                      >
                        Set Pending
                      </button>
                    )}
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
