import { ITagRepository } from "../../domain/repositories/ITagRepository";
import { Tag } from "../../domain/entities/Tag";
import { DatabaseManager } from "../database/DatabaseManager";

interface TagRow {
  id: number;
  name: string;
  color: string;
  user_id: number;
}

export class TagRepository implements ITagRepository {
  async create(tag: Tag): Promise<number> {
    const db = await DatabaseManager.getInstance();
    const result = await db.runAsync(
      `INSERT INTO tags (name, color, user_id) VALUES (?, ?, ?)`,
      [tag.name, tag.color, tag.userId]
    );
    return result.lastInsertRowId;
  }

  async findAll(): Promise<Tag[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<TagRow>(
      `SELECT * FROM tags ORDER BY name`
    );
    return rows.map((row) => new Tag(row.id, row.name, row.color, row.user_id));
  }

  async update(id: number, tag: Partial<Tag>): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const updates: string[] = [];
    const values: any[] = [];

    if (tag.name !== undefined) {
      updates.push("name = ?");
      values.push(tag.name);
    }
    if (tag.color !== undefined) {
      updates.push("color = ?");
      values.push(tag.color);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE tags SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    // Delete relacionamentos primeiro (CASCADE já faz isso, mas é bom garantir)
    await db.runAsync(`DELETE FROM expense_tags WHERE tag_id = ?`, [id]);
    await db.runAsync(`DELETE FROM tags WHERE id = ?`, [id]);
  }

  async addTagToExpense(expenseId: number, tagId: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(
      `INSERT OR IGNORE INTO expense_tags (expense_id, tag_id) VALUES (?, ?)`,
      [expenseId, tagId]
    );
  }

  async removeTagFromExpense(expenseId: number, tagId: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(
      `DELETE FROM expense_tags WHERE expense_id = ? AND tag_id = ?`,
      [expenseId, tagId]
    );
  }

  async findTagsByExpense(expenseId: number): Promise<Tag[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<TagRow>(
      `SELECT t.* FROM tags t
       INNER JOIN expense_tags et ON t.id = et.tag_id
       WHERE et.expense_id = ?
       ORDER BY t.name`,
      [expenseId]
    );
    return rows.map((row) => new Tag(row.id, row.name, row.color, row.user_id));
  }

  async findExpensesByTag(tagId: number): Promise<number[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<{ expense_id: number }>(
      `SELECT expense_id FROM expense_tags WHERE tag_id = ?`,
      [tagId]
    );
    return rows.map((row) => row.expense_id);
  }
}
