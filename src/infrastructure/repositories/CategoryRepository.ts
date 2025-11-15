import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import { DatabaseManager } from '../database/DatabaseManager';

export class CategoryRepository implements ICategoryRepository {
private db = DatabaseManager.getInstance();

async create(category: Category): Promise<number> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)`,
        [category.name, category.icon, category.color],
        (_, result) => resolve(result.insertId!),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findAll(): Promise<Category[]> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM categories`,
        [],
        (_, { rows }) => {
          const categories = rows._array.map(
            (row) => new Category(row.id, row.name, row.icon, row.color)
          );
          resolve(categories);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findById(id: number): Promise<Category | null> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM categories WHERE id = ?`,
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const row = rows.item(0);
            resolve(new Category(row.id, row.name, row.icon, row.color));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}
}