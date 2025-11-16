import { IRecurringExpenseRepository } from "../../domain/repositories/IRecurringExpenseRepository";
import {
  RecurringExpense,
  Frequency,
} from "../../domain/entities/RecurringExpense";
import { DatabaseManager } from "../database/DatabaseManager";

interface RecurringExpenseRow {
  id: number;
  frequency: Frequency;
  amount: number;
  emotion_id: number;
  category_id: number;
  note: string;
  start_date: string;
  end_date: string | null;
  is_active: number;
  user_id: number;
  type: "expense" | "saving";
}

export class RecurringExpenseRepository implements IRecurringExpenseRepository {
  async create(recurringExpense: RecurringExpense): Promise<number> {
    const db = await DatabaseManager.getInstance();
    const result = await db.runAsync(
      `INSERT INTO recurring_expenses (frequency, amount, emotion_id, category_id, note, start_date, end_date, is_active, user_id, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recurringExpense.frequency,
        recurringExpense.amount,
        recurringExpense.emotionId,
        recurringExpense.categoryId,
        recurringExpense.note,
        recurringExpense.startDate.toISOString(),
        recurringExpense.endDate?.toISOString() || null,
        recurringExpense.isActive ? 1 : 0,
        recurringExpense.userId,
        recurringExpense.type,
      ]
    );
    return result.lastInsertRowId;
  }

  async findAll(): Promise<RecurringExpense[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<RecurringExpenseRow>(
      `SELECT * FROM recurring_expenses ORDER BY start_date DESC`
    );
    return rows.map(this.rowToEntity);
  }

  async findActive(): Promise<RecurringExpense[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<RecurringExpenseRow>(
      `SELECT * FROM recurring_expenses WHERE is_active = 1`
    );
    return rows.map(this.rowToEntity);
  }

  async update(id: number, data: Partial<RecurringExpense>): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.frequency !== undefined) {
      updates.push("frequency = ?");
      values.push(data.frequency);
    }
    if (data.amount !== undefined) {
      updates.push("amount = ?");
      values.push(data.amount);
    }
    if (data.emotionId !== undefined) {
      updates.push("emotion_id = ?");
      values.push(data.emotionId);
    }
    if (data.categoryId !== undefined) {
      updates.push("category_id = ?");
      values.push(data.categoryId);
    }
    if (data.note !== undefined) {
      updates.push("note = ?");
      values.push(data.note);
    }
    if (data.startDate !== undefined) {
      updates.push("start_date = ?");
      values.push(data.startDate.toISOString());
    }
    if (data.endDate !== undefined) {
      updates.push("end_date = ?");
      values.push(data.endDate?.toISOString() || null);
    }
    if (data.isActive !== undefined) {
      updates.push("is_active = ?");
      values.push(data.isActive ? 1 : 0);
    }
    if (data.type !== undefined) {
      updates.push("type = ?");
      values.push(data.type);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE recurring_expenses SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(`DELETE FROM recurring_expenses WHERE id = ?`, [id]);
  }

  private rowToEntity(row: RecurringExpenseRow): RecurringExpense {
    return new RecurringExpense(
      row.id,
      row.frequency,
      row.amount,
      row.emotion_id,
      row.category_id,
      row.note,
      new Date(row.start_date),
      row.end_date ? new Date(row.end_date) : null,
      row.is_active === 1,
      row.user_id,
      row.type
    );
  }
}
