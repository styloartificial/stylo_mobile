export type StepStatus = 'pending' | 'done' | 'ready' | 'error';

export type GenerationStep = {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  timestamp?: string;
};