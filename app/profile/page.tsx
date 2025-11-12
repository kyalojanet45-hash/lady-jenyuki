'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import FormWizard with SSR disabled
const FormWizard = dynamic(
  () => import('@/components/FormWizard/FormWizard'),
  { ssr: false }
);

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900"></h1>
              <p className="text-gray-600 mt-2">
                {/* {viewType === 'placed' ? 'Orders you have placed' : 'Orders received for your bakery'} */}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 mt-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Proceed to Home
            </Link>
          </div>
        </div>
      <FormWizard />
    </div>
  );
}
