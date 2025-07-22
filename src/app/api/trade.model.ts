import { Figure } from './figure.model';

export interface Trade {
  id: number;
  status: string;
  initiatorFigures: Figure[];
  recipientFigures: Figure[];
}
