import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
create(expense: Expense): Promise<number>;
findAll(): Promise<Expense[]>;
findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]>;
findByEmotion(emotionId: number): Promise<Expense[]>;
findByCategory(categoryId: number): Promise<Expense[]>;
delete(id: number): Promise<void>;
}