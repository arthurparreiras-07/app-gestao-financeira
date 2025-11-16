import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Expense } from "../../domain/entities/Expense";
import { Category } from "../../domain/entities/Category";
import { Emotion } from "../../domain/entities/Emotion";
import { format } from "date-fns";

export class ExportService {
  /**
   * Exporta dados para CSV
   */
  async exportToCSV(
    expenses: Expense[],
    categories: Category[],
    emotions: Emotion[]
  ): Promise<void> {
    try {
      const getCategoryName = (id: number) =>
        categories.find((c) => c.id === id)?.name || "Desconhecido";
      const getEmotionName = (id: number) =>
        emotions.find((e) => e.id === id)?.name || "Desconhecido";

      // Cabeçalho
      const header = "Data,Tipo,Valor,Categoria,Emoção,Observações\n";

      // Linhas de dados
      const rows = expenses.map((e) => {
        const date = format(e.date, "dd/MM/yyyy HH:mm");
        const type = e.type === "expense" ? "Gasto" : "Economia";
        const amount = e.amount.toFixed(2);
        const category = getCategoryName(e.categoryId);
        const emotion = getEmotionName(e.emotionId);
        const note = (e.note || "").replace(/,/g, ";");

        return `${date},${type},${amount},${category},${emotion},"${note}"`;
      });

      const csvContent = header + rows.join("\n");

      // Salvar arquivo usando nova API do expo-file-system
      const fileName = `mindbudget_${format(
        new Date(),
        "yyyyMMdd_HHmmss"
      )}.csv`;
      const file = new File(Paths.document, fileName);

      await file.write(csvContent);

      // Compartilhar
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/csv",
          dialogTitle: "Exportar dados do MindBudget",
        });
      }
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      throw error;
    }
  }

  /**
   * Exporta dados para JSON (backup completo)
   */
  async exportToJSON(data: {
    expenses: Expense[];
    categories: Category[];
    emotions: Emotion[];
  }): Promise<void> {
    try {
      const jsonContent = JSON.stringify(data, null, 2);

      const fileName = `mindbudget_backup_${format(
        new Date(),
        "yyyyMMdd_HHmmss"
      )}.json`;
      const file = new File(Paths.document, fileName);

      await file.write(jsonContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Backup do MindBudget",
        });
      }
    } catch (error) {
      console.error("Erro ao exportar JSON:", error);
      throw error;
    }
  }

  /**
   * Exporta relatório formatado em texto
   */
  async exportReport(
    expenses: Expense[],
    categories: Category[],
    emotions: Emotion[],
    period: { start: Date; end: Date }
  ): Promise<void> {
    try {
      const getCategoryName = (id: number) =>
        categories.find((c) => c.id === id)?.name || "Desconhecido";
      const getEmotionName = (id: number) =>
        emotions.find((e) => e.id === id)?.name || "Desconhecido";

      const allExpenses = expenses.filter((e) => e.type === "expense");
      const allSavings = expenses.filter((e) => e.type === "saving");

      const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalSavings = allSavings.reduce((sum, e) => sum + e.amount, 0);
      const balance = totalSavings - totalExpenses;

      let report = `
╔══════════════════════════════════════════╗
║         RELATÓRIO MINDBUDGET             ║
╚══════════════════════════════════════════╝

Período: ${format(period.start, "dd/MM/yyyy")} a ${format(
        period.end,
        "dd/MM/yyyy"
      )}
Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RESUMO GERAL

Total de Gastos:     R$ ${totalExpenses.toFixed(2)}
Total de Economias:  R$ ${totalSavings.toFixed(2)}
Balanço:             R$ ${balance.toFixed(2)} ${balance >= 0 ? "✅" : "⚠️"}

Número de lançamentos: ${expenses.length}
  - Gastos:     ${allExpenses.length}
  - Economias:  ${allSavings.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 GASTOS POR CATEGORIA

`;

      // Agrupar gastos por categoria
      const expensesByCategory = categories
        .map((cat) => {
          const catExpenses = allExpenses.filter(
            (e) => e.categoryId === cat.id
          );
          const total = catExpenses.reduce((sum, e) => sum + e.amount, 0);
          return { name: cat.name, total, count: catExpenses.length };
        })
        .filter((c) => c.total > 0)
        .sort((a, b) => b.total - a.total);

      expensesByCategory.forEach((cat) => {
        const percentage = ((cat.total / totalExpenses) * 100).toFixed(1);
        report += `${cat.name.padEnd(20)} R$ ${cat.total
          .toFixed(2)
          .padStart(10)} (${percentage}%)\n`;
      });

      report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

😊 ANÁLISE EMOCIONAL

`;

      // Agrupar gastos por emoção
      const expensesByEmotion = emotions
        .map((emo) => {
          const emoExpenses = allExpenses.filter((e) => e.emotionId === emo.id);
          const total = emoExpenses.reduce((sum, e) => sum + e.amount, 0);
          return {
            name: emo.name,
            icon: emo.icon,
            total,
            count: emoExpenses.length,
          };
        })
        .filter((e) => e.total > 0)
        .sort((a, b) => b.total - a.total);

      expensesByEmotion.forEach((emo) => {
        const avg = emo.count > 0 ? (emo.total / emo.count).toFixed(2) : "0.00";
        report += `${emo.icon} ${emo.name.padEnd(15)} ${
          emo.count
        } lançamentos - Média: R$ ${avg}\n`;
      });

      report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 INSIGHTS

`;

      // Insights básicos
      if (expensesByCategory.length > 0) {
        report += `• Categoria com mais gastos: ${
          expensesByCategory[0].name
        } (R$ ${expensesByCategory[0].total.toFixed(2)})\n`;
      }
      if (expensesByEmotion.length > 0) {
        report += `• Emoção com mais gastos: ${expensesByEmotion[0].icon} ${expensesByEmotion[0].name}\n`;
      }
      if (balance >= 0) {
        report += `• Suas economias superaram seus gastos! ✨\n`;
      } else {
        report += `• Atenção: seus gastos superaram suas economias em R$ ${Math.abs(
          balance
        ).toFixed(2)}\n`;
      }

      report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gerado por MindBudget - Gestão Financeira com Análise Emocional
`;

      const fileName = `relatorio_mindbudget_${format(
        new Date(),
        "yyyyMMdd_HHmmss"
      )}.txt`;
      const file = new File(Paths.document, fileName);

      await file.write(report);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/plain",
          dialogTitle: "Relatório MindBudget",
        });
      }
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      throw error;
    }
  }
}
