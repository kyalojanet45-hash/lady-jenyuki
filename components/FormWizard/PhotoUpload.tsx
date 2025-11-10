'use client';

import { useFormContext } from '@/context/FormContext';
import { useRef } from 'react';

const PhotoUpload = () => {
  const { formData, setFormData } = useFormContext();
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => {
        const newPhotos = [...prev.photos];
        newPhotos[index] = file;
        return { ...prev, photos: newPhotos };
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = null;
      return { ...prev, photos: newPhotos };
    });
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current!.value = '';
    }
  };

  const handleUploadClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Upload Photos</h2>
        <p className="text-sm text-gray-600 mt-2">Please upload exactly 3 images for your profile</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image {index + 1} *
            </label>
            
            <div className="relative">
              {formData.photos[index] ? (
                <div className="relative group">
                  <img
                    src={URL.createObjectURL(formData.photos[index]!)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all transform hover:scale-110"
                      title="Remove photo"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => handleUploadClick(index)}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <svg
                    className="h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              
              <input
                ref={fileInputRefs[index]}
                type="file"
                accept="image/*"
                onChange={handleFileChange(index)}
                className="hidden"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              All three images are required to complete your profile. Click on each box to upload an image.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
