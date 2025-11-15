import { RecurringExpense } from '../entities/RecurringExpense';

export interface IRecurringExpenseRepository {
  create(recurringExpense: RecurringExpense): Promise<number>;
  findAll(): Promise<RecurringExpense[]>;
  findActive(): Promise<RecurringExpense[]>;
  update(id: number, data: Partial<RecurringExpense>): Promise<void>;
  delete(id: number): Promise<void>;
}
