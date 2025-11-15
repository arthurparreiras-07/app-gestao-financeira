import { IBudgetRepository } from "../../domain/repositories/IBudgetRepository";
import { Budget } from "../../domain/entities/Budget";
import { DatabaseManager } from "../database/DatabaseManager";

interface BudgetRow {
  id: number;
  category_id: number | null;
  monthly_limit: number;
  month: number;
  year: number;
  alert_threshold: number;
  user_id: number;
}

export class BudgetRepository implements IBudgetRepository {
  async create(budget: Budget): Promise<number> {
    const db = await DatabaseManager.getInstance();
    const result = await db.runAsync(
      `INSERT INTO budgets (category_id, monthly_limit, month, year, alert_threshold, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        budget.categoryId,
        budget.monthlyLimit,
        budget.month,
        budget.year,
        budget.alertThreshold,
        budget.userId,
      ]
    );
    return result.lastInsertRowId;
  }

  async findAll(): Promise<Budget[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<BudgetRow>(
      `SELECT * FROM budgets ORDER BY year DESC, month DESC`
    );
    return rows.map(
      (row) =>
        new Budget(
          row.id,
          row.category_id,
          row.monthly_limit,
          row.month,
          row.year,
          row.alert_threshold,
          row.user_id
        )
    );
  }

  async findByMonthYear(month: number, year: number): Promise<Budget[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<BudgetRow>(
      `SELECT * FROM budgets WHERE month = ? AND year = ?`,
      [month, year]
    );
    return rows.map(
      (row) =>
        new Budget(
          row.id,
          row.category_id,
          row.monthly_limit,
          row.month,
          row.year,
          row.alert_threshold,
          row.user_id
        )
    );
  }

  async findByCategory(
    categoryId: number,
    month: number,
    year: number
  ): Promise<Budget | null> {
    const db = await DatabaseManager.getInstance();
    const row = await db.getFirstAsync<BudgetRow>(
      `SELECT * FROM budgets WHERE category_id = ? AND month = ? AND year = ?`,
      [categoryId, month, year]
    );
    if (!row) return null;
    return new Budget(
      row.id,
      row.category_id,
      row.monthly_limit,
      row.month,
      row.year,
      row.alert_threshold,
      row.user_id
    );
  }

  async update(id: number, budget: Partial<Budget>): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const updates: string[] = [];
    const values: any[] = [];

    if (budget.monthlyLimit !== undefined) {
      updates.push("monthly_limit = ?");
      values.push(budget.monthlyLimit);
    }
    if (budget.alertThreshold !== undefined) {
      updates.push("alert_threshold = ?");
      values.push(budget.alertThreshold);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE budgets SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(`DELETE FROM budgets WHERE id = ?`, [id]);
  }
}
