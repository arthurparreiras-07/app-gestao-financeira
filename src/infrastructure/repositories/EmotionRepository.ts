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
}
