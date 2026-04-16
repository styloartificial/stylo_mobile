import { createContext, useContext, useState } from 'react';

export type ScanFormData = {
  image: string;
  lookTitle: string;
  selectedCategories: number[];
  occasion: string;
  style: string;
  detectedItems: any[];
  selectedProducts: any[];
  ticketId: string;
};

type ScanContextType = {
  formData: ScanFormData;
  updateFormData: (data: Partial<ScanFormData>) => void;
};

export const ScanContext = createContext<ScanContextType | null>(null);

export const ScanProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<ScanFormData>({
    image: '',
    lookTitle: '',
    selectedCategories: [],
    occasion: '',
    style: '',
    detectedItems: [],
    selectedProducts: [],
    ticketId: '',
  });

  const updateFormData = (data: Partial<ScanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <ScanContext.Provider value={{ formData, updateFormData }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used inside ScanProvider');
  return ctx;
};