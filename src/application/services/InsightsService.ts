import { Expense } from '../../domain/entities/Expense';
import { Emotion } from '../../domain/entities/Emotion';

export interface Insight {
id: string;
type: 'warning' | 'info' | 'success';
message: string;
icon: string;
}

export class InsightsService {
generateInsights(
  expenses: Expense[],
  emotions: Emotion[]
): Insight[] {
  const insights: Insight[] = [];

  // Calcular gasto por emoção
  const expensesByEmotion = this.groupExpensesByEmotion(expenses);
  const averageExpense = this.calculateAverageExpense(expenses);

  Object.entries(expensesByEmotion).forEach(([emotionId, emotionExpenses]) => {
    const emotion = emotions.find((e) => e.id === parseInt(emotionId));
    if (!emotion) return;

    const totalAmount = emotionExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgAmount = totalAmount / emotionExpenses.length;

    if (avgAmount > averageExpense * 1.2) {
      const percentage = Math.round(((avgAmount - averageExpense) / averageExpense) * 100);
      insights.push({
        id: `emotion-${emotionId}`,
        type: 'warning',
        message: `Você gasta ${percentage}% mais quando está ${emotion.name.toLowerCase()} ${emotion.icon}`,
        icon: '⚠️',
      });
    }
  });

  // Insight sobre gastos recentes
  const recentExpenses = expenses.slice(0, 10);
  if (recentExpenses.length >= 5) {
    const recentTotal = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
    insights.push({
      id: 'recent-spending',
      type: 'info',
      message: `Você gastou R$ ${recentTotal.toFixed(2)} nos últimos ${recentExpenses.length} registros`,
      icon: '📊',
    });
  }

  return insights;
}

private groupExpensesByEmotion(expenses: Expense[]): Record<number, Expense[]> {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.emotionId]) {
      acc[expense.emotionId] = [];
    }
    acc[expense.emotionId].push(expense);
    return acc;
  }, {} as Record<number, Expense[]>);
}

private calculateAverageExpense(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return total / expenses.length;
}
}