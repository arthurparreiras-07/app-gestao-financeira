import * as SQLite from 'expo-sqlite';
import { DatabaseManager } from './DatabaseManager';

/**
 * Arquivo de migrations para gerenciar versionamento e alterações do banco de dados
 */

export class DatabaseMigrations {
  private static readonly CURRENT_VERSION = 2;

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
      'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
    );

    if (row) {
      return row.version;
    } else {
      // Se não há versão, inserir versão 0
      await db.runAsync('INSERT INTO schema_version (version) VALUES (0)');
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

        // Adicione novos cases para versões futuras
        // case 3:
        //   await db.execAsync('ALTER TABLE expenses ADD COLUMN new_field TEXT;');
        //   break;
      }
    }

    // Atualizar versão no banco
    await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', [
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
    console.log('Database reset complete');
    await DatabaseManager.initialize();
  }
}
