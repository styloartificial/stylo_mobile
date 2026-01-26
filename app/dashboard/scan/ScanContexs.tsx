import { createContext, useContext } from 'react';

export type ScanFormData = {
  image: string;
  lookTitle: string;
  selectedCategories: string[];
  occasion: string;
  style: string;
  detectedItems: any[];
  selectedProducts: any[];
};

type ScanContextType = {
  formData: ScanFormData;
  updateFormData: (data: Partial<ScanFormData>) => void;
};

export const ScanContext = createContext<ScanContextType | null>(null);

export const useScan = () => {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used inside ScanProvider');
  return ctx;
};
