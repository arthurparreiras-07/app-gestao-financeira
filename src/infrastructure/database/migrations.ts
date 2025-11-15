import * as SQLite from "expo-sqlite";
import { DatabaseManager } from "./DatabaseManager";

/**
 * Arquivo de migrations para gerenciar versionamento e alterações do banco de dados
 */

export class DatabaseMigrations {
  private static readonly CURRENT_VERSION = 3;

  /**
   * Executa todas as migrations necessárias
   */
  static async runMigrations(): Promise<void> {
    const db = await DatabaseManager.getInstance();
    const currentVersion = await this.getCurrentVersion(db);

    console.log(`Database version: ${currentVersion}`);

    if (currentVersion < this.CURRENT_VERSION) {
      await this.migrate(db, currentVersion, this.CURRENT_VERSION);
    }
  }

  /**
   * Obtém a versão atual do banco de dados
   */
  private static async getCurrentVersion(
    db: SQLite.SQLiteDatabase
  ): Promise<number> {
    // Criar tabela de versão se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY
      );
    `);

    // Obter versão atual
    const row = await db.getFirstAsync<{ version: number }>(
      "SELECT version FROM schema_version ORDER BY version DESC LIMIT 1"
    );

    if (row) {
      return row.version;
    } else {
      // Se não há versão, inserir versão 0
      await db.runAsync("INSERT INTO schema_version (version) VALUES (0)");
      return 0;
    }
  }

  /**
   * Executa as migrations de uma versão para outra
   */
  private static async migrate(
    db: SQLite.SQLiteDatabase,
    fromVersion: number,
    toVersion: number
  ): Promise<void> {
    // Executar migrations em ordem
    for (let v = fromVersion + 1; v <= toVersion; v++) {
      switch (v) {
        case 1:
          // Migration inicial - já criada pelo DatabaseManager.initialize()
          // Aqui você pode adicionar índices extras ou ajustes
          await db.execAsync(
            `CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);`
          );
          break;

        case 2:
          // Adicionar campo type para diferenciar gastos de economias
          await db.execAsync(`
            ALTER TABLE expenses ADD COLUMN type TEXT DEFAULT 'expense';
          `);
          break;

        case 3:
          // Adicionar novas tabelas para features avançadas
          
          // Tabela de orçamentos
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS budgets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              category_id INTEGER,
              monthly_limit REAL NOT NULL,
              month INTEGER NOT NULL,
              year INTEGER NOT NULL,
              alert_threshold INTEGER DEFAULT 80,
              user_id INTEGER NOT NULL,
              FOREIGN KEY (category_id) REFERENCES categories(id),
              UNIQUE(category_id, month, year, user_id)
            );
          `);

          // Tabela de transações recorrentes
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS recurring_expenses (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              frequency TEXT NOT NULL,
              amount REAL NOT NULL,
              emotion_id INTEGER NOT NULL,
              category_id INTEGER NOT NULL,
              note TEXT,
              start_date TEXT NOT NULL,
              end_date TEXT,
              is_active INTEGER DEFAULT 1,
              user_id INTEGER NOT NULL,
              type TEXT DEFAULT 'expense',
              FOREIGN KEY (emotion_id) REFERENCES emotions(id),
              FOREIGN KEY (category_id) REFERENCES categories(id)
            );
          `);

          // Tabela de tags
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS tags (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              color TEXT NOT NULL,
              user_id INTEGER NOT NULL,
              UNIQUE(name, user_id)
            );
          `);

          // Tabela de relacionamento expense-tags
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS expense_tags (
              expense_id INTEGER NOT NULL,
              tag_id INTEGER NOT NULL,
              PRIMARY KEY (expense_id, tag_id),
              FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
              FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            );
          `);

          // Adicionar campo attachments na tabela expenses
          await db.execAsync(`
            ALTER TABLE expenses ADD COLUMN attachments TEXT DEFAULT '[]';
          `);

          // Criar índices para melhor performance
          await db.execAsync(`
            CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(month, year);
            CREATE INDEX IF NOT EXISTS idx_recurring_active ON recurring_expenses(is_active);
            CREATE INDEX IF NOT EXISTS idx_tags_user ON tags(user_id);
          `);
          
          break;

        // Adicione novos cases para versões futuras
        // case 4:
        //   await db.execAsync('ALTER TABLE expenses ADD COLUMN new_field TEXT;');
        //   break;
      }
    }

    // Atualizar versão no banco
    await db.runAsync("INSERT INTO schema_version (version) VALUES (?)", [
      toVersion,
    ]);
    console.log(`Database migrated to version ${toVersion}`);
  }

  /**
   * Limpa todos os dados do banco (útil para desenvolvimento/testes)
   */
  static async resetDatabase(): Promise<void> {
    const db = await DatabaseManager.getInstance();
    await db.execAsync(`
      DROP TABLE IF EXISTS expenses;
      DROP TABLE IF EXISTS emotions;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS schema_version;
    `);
    console.log("Database reset complete");
    await DatabaseManager.initialize();
  }
}
