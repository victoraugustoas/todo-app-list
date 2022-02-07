export type SnackType = 'error' | 'success';

export interface Snack {
  id: string;
  title: string;
  type: SnackType;
}

export interface SnackOptions extends Omit<Snack, 'id'> {}

export type SnackPosition = 'top' | 'bottom'; 

export interface SnackProviderProps {
  position?: SnackPosition;
  timeout?: number;
}
