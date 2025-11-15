import { Expense } from '../entities/Expense';
import { IExpenseRepository } from '../repositories/IExpenseRepository';

export class CreateExpenseUseCase {
constructor(private expenseRepository: IExpenseRepository) {}

async execute(data: {
  amount: number;
  date: Date;
  emotionId: number;
  categoryId: number;
  note: string;
  userId: number;
}): Promise<number> {
  const expense = Expense.create(data);
  return await this.expenseRepository.create(expense);
}
}