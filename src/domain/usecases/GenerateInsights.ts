import { Expense } from "../entities/Expense";
import { Emotion } from "../entities/Emotion";
import { Category } from "../entities/Category";
import { IExpenseRepository } from "../repositories/IExpenseRepository";
import { IEmotionRepository } from "../repositories/IEmotionRepository";
import { ICategoryRepository } from "../repositories/ICategoryRepository";

export interface Insight {
  id: string;
  type: "warning" | "info" | "success";
  message: string;
  icon: string;
}

export class GenerateInsightsUseCase {
  constructor(
    private expenseRepository: IExpenseRepository,
    private emotionRepository: IEmotionRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(): Promise<Insight[]> {
    const insights: Insight[] = [];

    const expenses = await this.expenseRepository.findAll();
    const emotions = await this.emotionRepository.findAll();
    const categories = await this.categoryRepository.findAll();

    if (expenses.length === 0) {
      return insights;
    }

    // Analisar gastos por emoção
    const expensesByEmotion = this.groupExpensesByEmotion(expenses);
    const averageExpense = this.calculateAverageExpense(expenses);

    for (const [emotionId, emotionExpenses] of Object.entries(
      expensesByEmotion
    )) {
      const emotion = emotions.find((e) => e.id === parseInt(emotionId));
      if (!emotion) continue;

      const totalAmount = emotionExpenses.reduce((sum, e) => sum + e.amount, 0);
      const avgAmount = totalAmount / emotionExpenses.length;

      if (avgAmount > averageExpense * 1.2) {
        const percentage = Math.round(
          ((avgAmount - averageExpense) / averageExpense) * 100
        );
        insights.push({
          id: `emotion-${emotionId}`,
          type: "warning",
          message: `Você gasta ${percentage}% mais quando está ${emotion.name.toLowerCase()} ${
            emotion.icon
          }`,
          icon: "⚠️",
        });
      }
    }

    // Analisar gastos por categoria
    const expensesByCategory = this.groupExpensesByCategory(expenses);
    const topCategory = this.findTopCategory(expensesByCategory, categories);

    if (topCategory) {
      insights.push({
        id: "top-category",
        type: "info",
        message: `Sua categoria com mais gastos é ${
          topCategory.category.name
        } ${topCategory.category.icon} com R$ ${topCategory.total.toFixed(2)}`,
        icon: "📊",
      });
    }

    // Insight sobre total de gastos
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    insights.push({
      id: "total-expenses",
      type: "info",
      message: `Total de gastos registrados: R$ ${totalExpenses.toFixed(
        2
      )} em ${expenses.length} lançamentos`,
      icon: "💰",
    });

    // Verificar tendência recente
    const recentExpenses = expenses.slice(0, 5);
    const olderExpenses = expenses.slice(5, 10);

    if (recentExpenses.length >= 3 && olderExpenses.length >= 3) {
      const recentAvg =
        recentExpenses.reduce((sum, e) => sum + e.amount, 0) /
        recentExpenses.length;
      const olderAvg =
        olderExpenses.reduce((sum, e) => sum + e.amount, 0) /
        olderExpenses.length;

      if (recentAvg > olderAvg * 1.3) {
        insights.push({
          id: "trend-up",
          type: "warning",
          message: "Seus gastos recentes estão aumentando. Fique atento!",
          icon: "📈",
        });
      } else if (recentAvg < olderAvg * 0.7) {
        insights.push({
          id: "trend-down",
          type: "success",
          message: "Parabéns! Seus gastos estão diminuindo!",
          icon: "📉",
        });
      }
    }

    return insights;
  }

  private groupExpensesByEmotion(
    expenses: Expense[]
  ): Record<number, Expense[]> {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.emotionId]) {
        acc[expense.emotionId] = [];
      }
      acc[expense.emotionId].push(expense);
      return acc;
    }, {} as Record<number, Expense[]>);
  }

  private groupExpensesByCategory(
    expenses: Expense[]
  ): Record<number, Expense[]> {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.categoryId]) {
        acc[expense.categoryId] = [];
      }
      acc[expense.categoryId].push(expense);
      return acc;
    }, {} as Record<number, Expense[]>);
  }

  private calculateAverageExpense(expenses: Expense[]): number {
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return total / expenses.length;
  }

  private findTopCategory(
    expensesByCategory: Record<number, Expense[]>,
    categories: Category[]
  ): { category: Category; total: number } | null {
    let topCategory: { category: Category; total: number } | null = null;
    let maxTotal = 0;

    for (const [categoryId, categoryExpenses] of Object.entries(
      expensesByCategory
    )) {
      const category = categories.find((c) => c.id === parseInt(categoryId));
      if (!category) continue;

      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      if (total > maxTotal) {
        maxTotal = total;
        topCategory = { category, total };
      }
    }

    return topCategory;
  }
}
