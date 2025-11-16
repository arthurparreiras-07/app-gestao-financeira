import { File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { Expense } from "../../domain/entities/Expense";
import { Category } from "../../domain/entities/Category";
import { Emotion } from "../../domain/entities/Emotion";
import { parse } from "date-fns";

export interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    expenses: Expense[];
    categories?: Category[];
    emotions?: Emotion[];
  };
  errors?: string[];
}

export class ImportService {
  /**
   * Importa dados de arquivo JSON (backup completo)
   */
  async importFromJSON(): Promise<ImportResult> {
    try {
      // Selecionar arquivo
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return {
          success: false,
          message: "Importação cancelada pelo usuário",
        };
      }

      // Ler conteúdo do arquivo
      const fileUri = result.assets[0].uri;
      const file = new File(fileUri);
      const fileContent = await file.text();

      // Parse do JSON
      const data = JSON.parse(fileContent);

      // Validar estrutura
      if (!data.expenses || !Array.isArray(data.expenses)) {
        return {
          success: false,
          message: "Arquivo JSON inválido: campo 'expenses' não encontrado",
        };
      }

      // Converter dados para entidades
      const expenses = this.parseExpenses(data.expenses);
      const categories = data.categories
        ? this.parseCategories(data.categories)
        : undefined;
      const emotions = data.emotions
        ? this.parseEmotions(data.emotions)
        : undefined;

      return {
        success: true,
        message: `${expenses.length} transações importadas com sucesso!`,
        data: {
          expenses,
          categories,
          emotions,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao importar arquivo JSON",
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Importa dados de arquivo CSV
   */
  async importFromCSV(): Promise<ImportResult> {
    try {
      // Selecionar arquivo
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return {
          success: false,
          message: "Importação cancelada pelo usuário",
        };
      }

      // Ler conteúdo do arquivo
      const fileUri = result.assets[0].uri;
      const file = new File(fileUri);
      const fileContent = await file.text();

      // Parse CSV
      const expenses = this.parseCSV(fileContent);

      return {
        success: true,
        message: `${expenses.length} transações importadas com sucesso!`,
        data: {
          expenses,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao importar arquivo CSV",
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Parse de CSV para array de Expenses
   */
  private parseCSV(csvContent: string): Expense[] {
    const lines = csvContent.split("\n").filter((line) => line.trim());

    // Ignorar cabeçalho
    const dataLines = lines.slice(1);

    const expenses: Expense[] = [];
    const errors: string[] = [];

    dataLines.forEach((line, index) => {
      try {
        // Parse da linha CSV
        const values = this.parseCSVLine(line);

        if (values.length < 6) {
          errors.push(`Linha ${index + 2}: formato inválido`);
          return;
        }

        const [dateStr, typeStr, amountStr, , , noteStr] = values;

        // Parse dos valores
        const date = parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
        const type = typeStr === "Gasto" ? "expense" : "saving";
        const amount = parseFloat(amountStr);

        // Criar expense
        const expense = new Expense(
          null,
          amount,
          date,
          1, // EmotionId temporário
          1, // CategoryId temporário
          noteStr.replace(/^"|"$/g, ""),
          1, // UserId
          type as "expense" | "saving",
          []
        );

        expenses.push(expense);
      } catch (error) {
        errors.push(
          `Linha ${index + 2}: ${
            error instanceof Error ? error.message : "erro desconhecido"
          }`
        );
      }
    });

    if (errors.length > 0) {
      console.warn("Erros durante importação CSV:", errors);
    }

    return expenses;
  }

  /**
   * Parse de linha CSV considerando aspas
   */
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current) {
      values.push(current.trim());
    }

    return values;
  }

  /**
   * Parse de array de objetos para Expenses
   */
  private parseExpenses(data: any[]): Expense[] {
    return data
      .map((item, index) => {
        try {
          return new Expense(
            item.id || null,
            item.amount,
            new Date(item.date),
            item.emotionId,
            item.categoryId,
            item.note || "",
            item.userId,
            item.type || "expense",
            item.attachments || []
          );
        } catch (error) {
          console.warn(`Erro ao parsear expense ${index}:`, error);
          return null;
        }
      })
      .filter((e): e is Expense => e !== null);
  }

  /**
   * Parse de array de objetos para Categories
   */
  private parseCategories(data: any[]): Category[] {
    return data
      .map((item, index) => {
        try {
          return new Category(
            item.id || null,
            item.name,
            item.icon,
            item.color
          );
        } catch (error) {
          console.warn(`Erro ao parsear category ${index}:`, error);
          return null;
        }
      })
      .filter((c): c is Category => c !== null);
  }

  /**
   * Parse de array de objetos para Emotions
   */
  private parseEmotions(data: any[]): Emotion[] {
    return data
      .map((item, index) => {
        try {
          return new Emotion(
            item.id || null,
            item.name,
            item.intensity || 3,
            item.icon
          );
        } catch (error) {
          console.warn(`Erro ao parsear emotion ${index}:`, error);
          return null;
        }
      })
      .filter((e): e is Emotion => e !== null);
  }

  /**
   * Valida se um arquivo é um backup válido do MindBudget
   */
  async validateBackupFile(uri: string): Promise<boolean> {
    try {
      const file = new File(uri);
      const content = await file.text();
      const data = JSON.parse(content);

      return (
        data &&
        typeof data === "object" &&
        Array.isArray(data.expenses) &&
        data.expenses.length >= 0
      );
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações sobre um arquivo de backup
   */
  async getBackupInfo(uri: string): Promise<{
    isValid: boolean;
    expenseCount?: number;
    categoryCount?: number;
    emotionCount?: number;
    oldestDate?: Date;
    newestDate?: Date;
  }> {
    try {
      const file = new File(uri);
      const content = await file.text();
      const data = JSON.parse(content);

      if (!data || !Array.isArray(data.expenses)) {
        return { isValid: false };
      }

      const dates = data.expenses
        .map((e: any) => new Date(e.date))
        .filter((d: Date) => !isNaN(d.getTime()));

      return {
        isValid: true,
        expenseCount: data.expenses.length,
        categoryCount: data.categories?.length || 0,
        emotionCount: data.emotions?.length || 0,
        oldestDate:
          dates.length > 0
            ? new Date(Math.min(...dates.map((d: Date) => d.getTime())))
            : undefined,
        newestDate:
          dates.length > 0
            ? new Date(Math.max(...dates.map((d: Date) => d.getTime())))
            : undefined,
      };
    } catch {
      return { isValid: false };
    }
  }
}
