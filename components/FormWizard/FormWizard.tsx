'use client';

import { FormProvider, useFormContext } from '@/context/FormContext';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PersonalInfo from './PersonalInfo';
import EducationExperience from './EducationExperience';
import PhotoUpload from './PhotoUpload';

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { number: 1, label: 'Personal Info', shortLabel: 'Info' },
    { number: 2, label: 'Education & Experience', shortLabel: 'Education' },
    { number: 3, label: 'Upload Photos', shortLabel: 'Photos' },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.number} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'border-2 border-gray-300 text-gray-500 bg-white'
                }`}
              >
                {currentStep > step.number ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm sm:text-base font-semibold">{step.number}</span>
                )}
              </div>
              <span className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`absolute top-5 sm:top-6 left-[calc(50%+20px)] sm:left-[calc(50%+24px)] right-[calc(-50%+20px)] sm:right-[calc(-50%+24px)] h-0.5 transition-colors ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const FormContent = () => {
  const { currentStep, nextStep, prevStep, formData } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentStep < 3) {
      nextStep();
    } else {
      // Check if user is authenticated
      if (status !== 'authenticated') {
        router.push('/auth/login');
        return;
      }

      // Handle form submission to backend
      setIsSubmitting(true);
      
      try {
        // Convert photos to base64 or handle file upload
        const photosData = formData.photos.map((photo) => {
          if (photo instanceof File) {
            return photo.name; // In production, upload to storage and return URL
          }
          return null;
        });

        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            bio: formData.bio,
            phone: formData.phone,
            educationEntries: formData.educationEntries,
            photos: photosData,
            businessName: formData.businessName,
            businessAddress: formData.businessAddress,
            specialties: formData.specialties,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to submit profile');
          return;
        }

        // Success
        alert('Profile submitted successfully!');
        router.push('/');
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <EducationExperience />;
      case 3:
        return <PhotoUpload />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <StepIndicator currentStep={currentStep} />
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : currentStep === 3 ? (
              'Submit'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const FormWizard = () => {
  return (
    <FormProvider>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Profile Setup Wizard
            </h1>
            <p className="text-gray-600">Complete your profile in 3 simple steps</p>
          </div>
          <FormContent />
        </div>
      </div>
    </FormProvider>
  );
};

export default FormWizard;
