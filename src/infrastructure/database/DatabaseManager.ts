import * as SQLite from "expo-sqlite";

export class DatabaseManager {
  private static instance: SQLite.SQLiteDatabase | null = null;

  static async getInstance(): Promise<SQLite.SQLiteDatabase> {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = await SQLite.openDatabaseAsync(
        "emotional_budget.db"
      );
    }
    return DatabaseManager.instance;
  }

  static async initialize(): Promise<void> {
    const db = await DatabaseManager.getInstance();

    // Tabela de usuários
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        preferences TEXT
      );
    `);

    // Tabela de emoções
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS emotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        intensity INTEGER,
        icon TEXT
      );
    `);

    // Tabela de categorias
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT
      );
    `);

    // Tabela de gastos
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        emotion_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        note TEXT,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (emotion_id) REFERENCES emotions(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Índices para otimização
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE INDEX IF NOT EXISTS idx_expenses_emotion ON expenses(emotion_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
    `);
  }
}
