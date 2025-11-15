import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { Expense } from '../../domain/entities/Expense';
import { DatabaseManager } from '../database/DatabaseManager';

export class ExpenseRepository implements IExpenseRepository {
private db = DatabaseManager.getInstance();

async create(expense: Expense): Promise<number> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO expenses (amount, date, emotion_id, category_id, note, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          expense.amount,
          expense.date.toISOString(),
          expense.emotionId,
          expense.categoryId,
          expense.note,
          expense.userId,
        ],
        (_, result) => resolve(result.insertId!),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findAll(): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM expenses ORDER BY date DESC`,
        [],
        (_, { rows }) => {
          const expenses = rows._array.map(
            (row) =>
              new Expense(
                row.id,
                row.amount,
                new Date(row.date),
                row.emotion_id,
                row.category_id,
                row.note,
                row.user_id
              )
          );
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM expenses WHERE date BETWEEN ? AND ? ORDER BY date DESC`,
        [startDate.toISOString(), endDate.toISOString()],
        (_, { rows }) => {
          const expenses = rows._array.map(
            (row) =>
              new Expense(
                row.id,
                row.amount,
                new Date(row.date),
                row.emotion_id,
                row.category_id,
                row.note,
                row.user_id
              )
          );
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findByEmotion(emotionId: number): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM expenses WHERE emotion_id = ? ORDER BY date DESC`,
        [emotionId],
        (_, { rows }) => {
          const expenses = rows._array.map(
            (row) =>
              new Expense(
                row.id,
                row.amount,
                new Date(row.date),
                row.emotion_id,
                row.category_id,
                row.note,
                row.user_id
              )
          );
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findByCategory(categoryId: number): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM expenses WHERE category_id = ? ORDER BY date DESC`,
        [categoryId],
        (_, { rows }) => {
          const expenses = rows._array.map(
            (row) =>
              new Expense(
                row.id,
                row.amount,
                new Date(row.date),
                row.emotion_id,
                row.category_id,
                row.note,
                row.user_id
              )
          );
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async delete(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM expenses WHERE id = ?`,
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
}