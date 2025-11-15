import { Budget } from '../entities/Budget';

export interface IBudgetRepository {
  create(budget: Budget): Promise<number>;
  findAll(): Promise<Budget[]>;
  findByMonthYear(month: number, year: number): Promise<Budget[]>;
  findByCategory(categoryId: number, month: number, year: number): Promise<Budget | null>;
  update(id: number, budget: Partial<Budget>): Promise<void>;
  delete(id: number): Promise<void>;
}
