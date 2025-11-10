'use client';

import { useState, useEffect } from 'react';
import { EducationEntry } from '@/context/FormContext';

type EducationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: EducationEntry) => void;
  editEntry?: EducationEntry | null;
};

const EducationModal = ({ isOpen, onClose, onSave, editEntry }: EducationModalProps) => {
  const [formData, setFormData] = useState<Omit<EducationEntry, 'id'>>({
    universityName: '',
    courseName: '',
    graduationYear: '',
  });

  useEffect(() => {
    if (editEntry) {
      setFormData({
        universityName: editEntry.universityName,
        courseName: editEntry.courseName,
        graduationYear: editEntry.graduationYear,
      });
    } else {
      setFormData({
        universityName: '',
        courseName: '',
        graduationYear: '',
      });
    }
  }, [editEntry, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: EducationEntry = {
      id: editEntry?.id || Date.now().toString(),
      ...formData,
    };
    onSave(entry);
    setFormData({
      universityName: '',
      courseName: '',
      graduationYear: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                    {editEntry ? 'Edit Education Entry' : 'Add Education Entry'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="universityName" className="block text-sm font-medium text-gray-700">
                        University/Institution Name *
                      </label>
                      <input
                        type="text"
                        id="universityName"
                        name="universityName"
                        value={formData.universityName}
                        onChange={handleChange}
                        className="mt-1 block text-black w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                        Name of Course *
                      </label>
                      <input
                        type="text"
                        id="courseName"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        className="mt-1 block text-black w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                        Year of Graduation *
                      </label>
                      <input
                        type="text"
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        placeholder="e.g., 2024"
                        className="mt-1 block text-black w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                {editEntry ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EducationModal;
