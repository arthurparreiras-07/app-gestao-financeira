import { Expense } from "../entities/Expense";
import { IExpenseRepository } from "../repositories/IExpenseRepository";

export class GetExpensesByEmotionUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(emotionId: number): Promise<Expense[]> {
    return await this.expenseRepository.findByEmotion(emotionId);
  }
}
