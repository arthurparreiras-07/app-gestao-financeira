import * as SQLite from 'expo-sqlite';

export class DatabaseManager {
private static instance: SQLite.WebSQLDatabase;

static getInstance(): SQLite.WebSQLDatabase {
  if (!DatabaseManager.instance) {
    DatabaseManager.instance = SQLite.openDatabase('emotional_budget.db');
  }
  return DatabaseManager.instance;
}

static async initialize(): Promise<void> {
  const db = DatabaseManager.getInstance();

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Tabela de usuários
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            preferences TEXT
          );`
        );

        // Tabela de emoções
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS emotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            intensity INTEGER,
            icon TEXT
          );`
        );

        // Tabela de categorias
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT,
            color TEXT
          );`
        );

        // Tabela de gastos
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS expenses (
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
          );`
        );

        // Índices para otimização
        tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);`
        );
        tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_expenses_emotion ON expenses(emotion_id);`
        );
        tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);`
        );
      },
      (error) => reject(error),
      () => resolve()
    );
  });
}
}