import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { Category } from "../../domain/entities/Category";
import { DatabaseManager } from "../database/DatabaseManager";

export class CategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<number> {
    const db = await DatabaseManager.getInstance();
    const result = await db.runAsync(
      `INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)`,
      [category.name, category.icon, category.color]
    );
    return result.lastInsertRowId;
  }

  async findAll(): Promise<Category[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<{
      id: number;
      name: string;
      icon: string;
      color: string;
    }>(`SELECT * FROM categories`);
    return rows.map(
      (row) => new Category(row.id, row.name, row.icon, row.color)
    );
  }

  async findById(id: number): Promise<Category | null> {
    const db = await DatabaseManager.getInstance();
    const row = await db.getFirstAsync<{
      id: number;
      name: string;
      icon: string;
      color: string;
    }>(`SELECT * FROM categories WHERE id = ?`, [id]);
    if (row) {
      return new Category(row.id, row.name, row.icon, row.color);
    }
    return null;
  }

  async update(id: number, data: Partial<Category>): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.icon !== undefined) {
      updates.push("icon = ?");
      values.push(data.icon);
    }
    if (data.color !== undefined) {
      updates.push("color = ?");
      values.push(data.color);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(`DELETE FROM categories WHERE id = ?`, [id]);
  }
}
