export type StepStatus = 'pending' | 'done' | 'ready' | 'error';

export type GenerationStep = {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  timestamp?: string;
};

export type SavedTag = {
  id: string;
  label: string;
};

export type SavedItem = {
  id: string;
  type: 'outfit' | 'single';
  title: string;
  imageUrl: string;
  date: string;
  category: string;
  tags: SavedTag[];
  outfitId?: string;
  
};