'use client';

import dynamic from 'next/dynamic';

// Dynamically import FormWizard with SSR disabled
const FormWizard = dynamic(
  () => import('@/components/FormWizard/FormWizard'),
  { ssr: false }
);

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <FormWizard />
    </div>
  );
}
