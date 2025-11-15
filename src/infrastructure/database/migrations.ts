import * as SQLite from "expo-sqlite";
import { DatabaseManager } from "./DatabaseManager";

/**
 * Arquivo de migrations para gerenciar versionamento e alterações do banco de dados
 */

export class DatabaseMigrations {
  private static readonly CURRENT_VERSION = 1;

  /**
   * Executa todas as migrations necessárias
   */
  static async runMigrations(): Promise<void> {
    const db = DatabaseManager.getInstance();
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
    db: SQLite.WebSQLDatabase
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // Criar tabela de versão se não existir
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS schema_version (
            version INTEGER PRIMARY KEY
          );`
        );

        // Obter versão atual
        tx.executeSql(
          "SELECT version FROM schema_version ORDER BY version DESC LIMIT 1",
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows.item(0).version);
            } else {
              // Se não há versão, inserir versão 0
              tx.executeSql(
                "INSERT INTO schema_version (version) VALUES (0)",
                [],
                () => resolve(0),
                (_, error) => {
                  reject(error);
                  return false;
                }
              );
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

  /**
   * Executa as migrations de uma versão para outra
   */
  private static async migrate(
    db: SQLite.WebSQLDatabase,
    fromVersion: number,
    toVersion: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          // Executar migrations em ordem
          for (let v = fromVersion + 1; v <= toVersion; v++) {
            switch (v) {
              case 1:
                // Migration inicial - já criada pelo DatabaseManager.initialize()
                // Aqui você pode adicionar índices extras ou ajustes
                tx.executeSql(
                  `CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);`
                );
                break;

              // Adicione novos cases para versões futuras
              // case 2:
              //   tx.executeSql('ALTER TABLE expenses ADD COLUMN new_field TEXT;');
              //   break;
            }
          }

          // Atualizar versão no banco
          tx.executeSql("INSERT INTO schema_version (version) VALUES (?)", [
            toVersion,
          ]);
        },
        (error) => reject(error),
        () => {
          console.log(`Database migrated to version ${toVersion}`);
          resolve();
        }
      );
    });
  }

  /**
   * Limpa todos os dados do banco (útil para desenvolvimento/testes)
   */
  static async resetDatabase(): Promise<void> {
    const db = DatabaseManager.getInstance();
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql("DROP TABLE IF EXISTS expenses");
          tx.executeSql("DROP TABLE IF EXISTS emotions");
          tx.executeSql("DROP TABLE IF EXISTS categories");
          tx.executeSql("DROP TABLE IF EXISTS users");
          tx.executeSql("DROP TABLE IF EXISTS schema_version");
        },
        (error) => reject(error),
        async () => {
          console.log("Database reset complete");
          await DatabaseManager.initialize();
          resolve();
        }
      );
    });
  }
}
