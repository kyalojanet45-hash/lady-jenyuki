'use client';

import { createContext, useContext, useState } from 'react';

export type EducationEntry = {
  id: string;
  universityName: string;
  courseName: string;
  graduationYear: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  educationEntries: EducationEntry[];
  photos: (File | null)[];
  businessName?: string;
  businessAddress?: string;
  specialties?: string[];
};

type FormContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
};

const initialData: FormData = {
  firstName: '',
  lastName: '',
  bio: '',
  phone: '',
  educationEntries: [],
  photos: [null, null, null],
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <FormContext.Provider value={{ formData, setFormData, currentStep, nextStep, prevStep }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
