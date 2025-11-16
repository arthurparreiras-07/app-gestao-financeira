import { Expense } from "../domain/entities/Expense";

export interface StatisticsData {
  average: number;
  median: number;
  min: number;
  max: number;
  total: number;
  count: number;
}

/**
 * Calcula estatísticas de um array de despesas
 */
export function calculateStatistics(expenses: Expense[]): StatisticsData {
  if (expenses.length === 0) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      total: 0,
      count: 0,
    };
  }

  const amounts = expenses.map((e) => e.amount).sort((a, b) => a - b);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  const count = amounts.length;
  const average = total / count;

  // Calcular mediana
  const middle = Math.floor(count / 2);
  const median =
    count % 2 === 0 ? (amounts[middle - 1] + amounts[middle]) / 2 : amounts[middle];

  return {
    average,
    median,
    min: amounts[0],
    max: amounts[count - 1],
    total,
    count,
  };
}

/**
 * Agrupa despesas por mês
 */
export function groupByMonth(expenses: Expense[]): Record<string, Expense[]> {
  return expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);
}

/**
 * Agrupa despesas por semana
 */
export function groupByWeek(expenses: Expense[]): Record<string, Expense[]> {
  return expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);
}

/**
 * Agrupa despesas por dia
 */
export function groupByDay(expenses: Expense[]): Record<string, Expense[]> {
  return expenses.reduce((acc, expense) => {
    const dateKey = new Date(expense.date).toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);
}

/**
 * Calcula tendência (crescimento ou decrescimento)
 */
export function calculateTrend(
  currentPeriod: Expense[],
  previousPeriod: Expense[]
): {
  percentage: number;
  direction: "up" | "down" | "stable";
  currentTotal: number;
  previousTotal: number;
} {
  const currentTotal = currentPeriod.reduce((sum, e) => sum + e.amount, 0);
  const previousTotal = previousPeriod.reduce((sum, e) => sum + e.amount, 0);

  if (previousTotal === 0) {
    return {
      percentage: currentTotal > 0 ? 100 : 0,
      direction: currentTotal > 0 ? "up" : "stable",
      currentTotal,
      previousTotal,
    };
  }

  const percentage = ((currentTotal - previousTotal) / previousTotal) * 100;

  return {
    percentage: Math.abs(percentage),
    direction: percentage > 1 ? "up" : percentage < -1 ? "down" : "stable",
    currentTotal,
    previousTotal,
  };
}

/**
 * Obtém top N categorias por gasto
 */
export function getTopCategories(
  expenses: Expense[],
  categories: Array<{ id: number | null; name: string }>,
  limit: number = 5
): Array<{ categoryId: number; categoryName: string; total: number; count: number }> {
  const grouped = expenses.reduce((acc, expense) => {
    if (!acc[expense.categoryId]) {
      acc[expense.categoryId] = {
        total: 0,
        count: 0,
      };
    }
    acc[expense.categoryId].total += expense.amount;
    acc[expense.categoryId].count += 1;
    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  return Object.entries(grouped)
    .map(([categoryId, data]) => ({
      categoryId: Number(categoryId),
      categoryName:
        categories.find((c) => c.id === Number(categoryId))?.name || "Desconhecido",
      total: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/**
 * Obtém dias com mais gastos
 */
export function getTopSpendingDays(
  expenses: Expense[],
  limit: number = 5
): Array<{ date: string; total: number; count: number }> {
  const grouped = groupByDay(expenses);

  return Object.entries(grouped)
    .map(([date, dayExpenses]) => ({
      date,
      total: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: dayExpenses.length,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
