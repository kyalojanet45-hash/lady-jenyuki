'use client';

import { useState } from 'react';
import { useFormContext, EducationEntry } from '@/context/FormContext';
import EducationModal from './EducationModal';

const EducationExperience = () => {
  const { formData, setFormData } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EducationEntry | null>(null);

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: EducationEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (entry: EducationEntry) => {
    setFormData(prev => {
      const existingIndex = prev.educationEntries.findIndex(e => e.id === entry.id);
      if (existingIndex >= 0) {
        // Update existing entry
        const newEntries = [...prev.educationEntries];
        newEntries[existingIndex] = entry;
        return { ...prev, educationEntries: newEntries };
      } else {
        // Add new entry
        return { ...prev, educationEntries: [...prev.educationEntries, entry] };
      }
    });
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.filter(e => e.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Education & Experience</h2>
        <button
          type="button"
          onClick={handleAddEntry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>

      {formData.educationEntries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No education entries</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first education entry.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.educationEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{entry.universityName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{entry.courseName}</p>
                  <p className="text-sm text-gray-500 mt-1">Graduated: {entry.graduationYear}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEditEntry(entry)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EducationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        editEntry={editingEntry}
      />
    </div>
  );
};

export default EducationExperience;
