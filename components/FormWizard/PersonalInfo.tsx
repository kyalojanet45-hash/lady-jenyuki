'use client';

import { useFormContext } from '@/context/FormContext';
import { useSession } from 'next-auth/react';

const PersonalInfo = () => {
  const { formData, setFormData } = useFormContext();
  const { data: session } = useSession();
  const isBaker = session?.user?.role === 'BAKER';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specialties = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-black font-bold mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Brief description for your profile. Optional.
        </p>
      </div>

      {/* Baker-specific fields */}
      {isBaker && (
        <>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName || ''}
              onChange={handleChange}
              placeholder="Your bakery name"
              className="block w-full  text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Business Address
            </label>
            <input
              type="text"
              id="businessAddress"
              name="businessAddress"
              value={formData.businessAddress || ''}
              onChange={handleChange}
              placeholder="Your bakery address"
              className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-1">
              Specialties
            </label>
            <input
              type="text"
              id="specialties"
              name="specialties"
              value={formData.specialties?.join(', ') || ''}
              onChange={handleSpecialtiesChange}
              placeholder="Croissants, Cakes, Cookies (comma separated)"
              className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your bakery specialties separated by commas
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalInfo;
