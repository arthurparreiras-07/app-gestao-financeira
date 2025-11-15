import { IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import { Expense, TransactionType } from "../../domain/entities/Expense";
import { DatabaseManager } from "../database/DatabaseManager";

interface ExpenseRow {
  id: number;
  amount: number;
  date: string;
  emotion_id: number;
  category_id: number;
  note: string;
  user_id: number;
  type: TransactionType;
  attachments: string;
}

export class ExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<number> {
    try {
      console.log("ExpenseRepository.create - Dados:", {
        amount: expense.amount,
        emotionId: expense.emotionId,
        categoryId: expense.categoryId,
        type: expense.type,
        userId: expense.userId,
      });

      const db = await DatabaseManager.getInstance();
      const result = await db.runAsync(
        `INSERT INTO expenses (amount, date, emotion_id, category_id, note, user_id, type, attachments)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.amount,
          expense.date.toISOString(),
          expense.emotionId,
          expense.categoryId,
          expense.note,
          expense.userId,
          expense.type,
          JSON.stringify(expense.attachments || []),
        ]
      );
      console.log(
        "ExpenseRepository.create - Sucesso! ID:",
        result.lastInsertRowId
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("ExpenseRepository.create - Erro:", error);
      throw error;
    }
  }

  async findAll(): Promise<Expense[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<ExpenseRow>(
      `SELECT * FROM expenses ORDER BY date DESC`
    );
    return rows.map(this.rowToEntity);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<ExpenseRow>(
      `SELECT * FROM expenses WHERE date BETWEEN ? AND ? ORDER BY date DESC`,
      [startDate.toISOString(), endDate.toISOString()]
    );
    return rows.map(this.rowToEntity);
  }

  async findByEmotion(emotionId: number): Promise<Expense[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<ExpenseRow>(
      `SELECT * FROM expenses WHERE emotion_id = ? ORDER BY date DESC`,
      [emotionId]
    );
    return rows.map(this.rowToEntity);
  }

  async findByCategory(categoryId: number): Promise<Expense[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<ExpenseRow>(
      `SELECT * FROM expenses WHERE category_id = ? ORDER BY date DESC`,
      [categoryId]
    );
    return rows.map(this.rowToEntity);
  }

  async update(id: number, data: Partial<Expense>): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.amount !== undefined) {
      updates.push("amount = ?");
      values.push(data.amount);
    }
    if (data.date !== undefined) {
      updates.push("date = ?");
      values.push(data.date.toISOString());
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
    if (data.type !== undefined) {
      updates.push("type = ?");
      values.push(data.type);
    }
    if (data.attachments !== undefined) {
      updates.push("attachments = ?");
      values.push(JSON.stringify(data.attachments));
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE expenses SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(`DELETE FROM expenses WHERE id = ?`, [id]);
  }

  private rowToEntity(row: ExpenseRow): Expense {
    let attachments: string[] = [];
    try {
      attachments = row.attachments ? JSON.parse(row.attachments) : [];
    } catch (e) {
      attachments = [];
    }

    return new Expense(
      row.id,
      row.amount,
      new Date(row.date),
      row.emotion_id,
      row.category_id,
      row.note,
      row.user_id,
      row.type || "expense",
      attachments
    );
  }
}
