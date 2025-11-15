import { Expense } from "../../domain/entities/Expense";
import { Emotion } from "../../domain/entities/Emotion";

export interface Insight {
  id: string;
  type: "warning" | "info" | "success";
  message: string;
  icon: string;
}

export class InsightsService {
  generateInsights(expenses: Expense[], emotions: Emotion[]): Insight[] {
    const insights: Insight[] = [];

    // Separar gastos e economias
    const allExpenses = expenses.filter((e) => e.type === "expense");
    const allSavings = expenses.filter((e) => e.type === "saving");

    // Calcular gasto por emoção
    const expensesByEmotion = this.groupExpensesByEmotion(allExpenses);
    const averageExpense = this.calculateAverageExpense(allExpenses);

    Object.entries(expensesByEmotion).forEach(
      ([emotionId, emotionExpenses]) => {
        const emotion = emotions.find((e) => e.id === parseInt(emotionId));
        if (!emotion) return;

        const totalAmount = emotionExpenses.reduce(
          (sum, e) => sum + e.amount,
          0
        );
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
    );

    // Calcular economia por emoção
    const savingsByEmotion = this.groupExpensesByEmotion(allSavings);
    const averageSaving = this.calculateAverageExpense(allSavings);

    Object.entries(savingsByEmotion).forEach(([emotionId, emotionSavings]) => {
      const emotion = emotions.find((e) => e.id === parseInt(emotionId));
      if (!emotion) return;

      const totalAmount = emotionSavings.reduce((sum, e) => sum + e.amount, 0);
      const avgAmount = totalAmount / emotionSavings.length;

      if (avgAmount > averageSaving * 1.2) {
        const percentage = Math.round(
          ((avgAmount - averageSaving) / averageSaving) * 100
        );
        insights.push({
          id: `saving-emotion-${emotionId}`,
          type: "success",
          message: `Você economiza ${percentage}% mais quando está ${emotion.name.toLowerCase()} ${
            emotion.icon
          }`,
          icon: "💰",
        });
      }
    });

    // Insight sobre gastos recentes
    const recentExpenses = allExpenses.slice(0, 10);
    if (recentExpenses.length >= 5) {
      const recentTotal = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
      insights.push({
        id: "recent-spending",
        type: "info",
        message: `Você gastou R$ ${recentTotal.toFixed(2)} nos últimos ${
          recentExpenses.length
        } registros`,
        icon: "📊",
      });
    }

    // Insight sobre economias recentes
    const recentSavings = allSavings.slice(0, 10);
    if (recentSavings.length >= 5) {
      const recentTotal = recentSavings.reduce((sum, e) => sum + e.amount, 0);
      insights.push({
        id: "recent-savings",
        type: "success",
        message: `Você economizou R$ ${recentTotal.toFixed(2)} nos últimos ${
          recentSavings.length
        } registros`,
        icon: "💵",
      });
    }

    // Comparar gastos vs economias
    if (allExpenses.length > 0 && allSavings.length > 0) {
      const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);

      if (totalSavings > totalExpenses) {
        const percentage = Math.round(
          ((totalSavings - totalExpenses) / totalExpenses) * 100
        );
        insights.push({
          id: "savings-vs-expenses",
          type: "success",
          message: `Parabéns! Você economizou ${percentage}% a mais do que gastou! 🎉`,
          icon: "🏆",
        });
      } else if (totalExpenses > totalSavings * 1.5) {
        const percentage = Math.round(
          ((totalExpenses - totalSavings) / totalSavings) * 100
        );
        insights.push({
          id: "expenses-vs-savings",
          type: "warning",
          message: `Atenção! Seus gastos são ${percentage}% maiores que suas economias`,
          icon: "⚠️",
        });
      } else {
        insights.push({
          id: "balanced-finances",
          type: "info",
          message: `Suas finanças estão equilibradas entre gastos e economias`,
          icon: "⚖️",
        });
      }
    }

    // Insight sobre consistência de economia
    if (allSavings.length >= 3) {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const monthlySavings = allSavings.filter(
        (s) =>
          s.date.getMonth() === thisMonth && s.date.getFullYear() === thisYear
      );

      if (monthlySavings.length >= 3) {
        insights.push({
          id: "consistent-saver",
          type: "success",
          message: `Você já economizou ${monthlySavings.length} vezes este mês! Continue assim! 💪`,
          icon: "🌟",
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

  private calculateAverageExpense(expenses: Expense[]): number {
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return total / expenses.length;
  }
}
