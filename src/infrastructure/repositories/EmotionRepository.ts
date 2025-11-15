import { IEmotionRepository } from '../../domain/repositories/IEmotionRepository';
import { Emotion } from '../../domain/entities/Emotion';
import { DatabaseManager } from '../database/DatabaseManager';

export class EmotionRepository implements IEmotionRepository {
private db = DatabaseManager.getInstance();

async create(emotion: Emotion): Promise<number> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO emotions (name, intensity, icon) VALUES (?, ?, ?)`,
        [emotion.name, emotion.intensity, emotion.icon],
        (_, result) => resolve(result.insertId!),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findAll(): Promise<Emotion[]> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM emotions`,
        [],
        (_, { rows }) => {
          const emotions = rows._array.map(
            (row) => new Emotion(row.id, row.name, row.intensity, row.icon)
          );
          resolve(emotions);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

async findById(id: number): Promise<Emotion | null> {
  return new Promise((resolve, reject) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM emotions WHERE id = ?`,
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const row = rows.item(0);
            resolve(new Emotion(row.id, row.name, row.intensity, row.icon));
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