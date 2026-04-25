import { createContext, useContext, useState, useEffect } from 'react';
import { getScanCategories, ScanCategoriesGrouped } from 'services/scanApi';

export type SelectedCategories = {
  item: number[];
  occasion: number[];
  style: number[];
  hijab: number[];
};

export type ScanFormData = {
  image: { uri: string; type: string; name: string } | null;
  lookTitle: string;
  selectedCategories: SelectedCategories;
  detectedItems: any[];
  selectedProducts: any[];
  ticketId: string;
};

type ScanContextType = {
  formData: ScanFormData;
  updateFormData: (data: Partial<ScanFormData>) => void;
  categories: ScanCategoriesGrouped;
  isLoadingCategories: boolean;
};

export const ScanContext = createContext<ScanContextType | null>(null);

export const ScanProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<ScanFormData>({
    image: null,
    lookTitle: '',
    selectedCategories: {
      item: [],
      occasion: [],
      style: [],
      hijab: [],
    },
    detectedItems: [],
    selectedProducts: [],
    ticketId: '',
  });

  const [categories, setCategories] = useState<ScanCategoriesGrouped>({
    item: [], occasion: [], style: [], hijab: [],
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    getScanCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoadingCategories(false));
  }, []);

  const updateFormData = (data: Partial<ScanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <ScanContext.Provider value={{ formData, updateFormData, categories, isLoadingCategories }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used inside ScanProvider');
  return ctx;
};