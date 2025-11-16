import { IEmotionRepository } from "../../domain/repositories/IEmotionRepository";
import { Emotion } from "../../domain/entities/Emotion";
import { DatabaseManager } from "../database/DatabaseManager";

export class EmotionRepository implements IEmotionRepository {
  async create(emotion: Emotion): Promise<number> {
    const db = await DatabaseManager.getInstance();
    const result = await db.runAsync(
      `INSERT INTO emotions (name, intensity, icon) VALUES (?, ?, ?)`,
      [emotion.name, emotion.intensity, emotion.icon]
    );
    return result.lastInsertRowId;
  }

  async findAll(): Promise<Emotion[]> {
    const db = await DatabaseManager.getInstance();
    const rows = await db.getAllAsync<{
      id: number;
      name: string;
      intensity: number;
      icon: string;
    }>(`SELECT * FROM emotions`);
    return rows.map(
      (row) => new Emotion(row.id, row.name, row.intensity, row.icon)
    );
  }

  async findById(id: number): Promise<Emotion | null> {
    const db = await DatabaseManager.getInstance();
    const row = await db.getFirstAsync<{
      id: number;
      name: string;
      intensity: number;
      icon: string;
    }>(`SELECT * FROM emotions WHERE id = ?`, [id]);
    if (row) {
      return new Emotion(row.id, row.name, row.intensity, row.icon);
    }
    return null;
  }

  async update(id: number, data: Partial<Emotion>): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.intensity !== undefined) {
      updates.push("intensity = ?");
      values.push(data.intensity);
    }
    if (data.icon !== undefined) {
      updates.push("icon = ?");
      values.push(data.icon);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE emotions SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.runAsync(`DELETE FROM emotions WHERE id = ?`, [id]);
  }
}
