import { RecurringExpense } from "../../domain/entities/RecurringExpense";
import { Expense } from "../../domain/entities/Expense";
import { IRecurringExpenseRepository } from "../../domain/repositories/IRecurringExpenseRepository";
import { IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";

export class RecurringExpenseService {
  constructor(
    private recurringRepository: IRecurringExpenseRepository,
    private expenseRepository: IExpenseRepository
  ) {}

  /**
   * Processa transações recorrentes pendentes
   * Deve ser chamado ao iniciar o app
   */
  async processRecurringExpenses(): Promise<number> {
    const activeRecurring = await this.recurringRepository.findActive();
    const today = startOfDay(new Date());
    let created = 0;

    for (const recurring of activeRecurring) {
      let lastDate = await this.getLastCreatedDate(recurring);

      // Se nunca foi criada nenhuma transação, usar a startDate como referência
      let currentDate = lastDate || recurring.startDate;

      // Criar todas as transações pendentes até hoje
      while (true) {
        const nextDate = lastDate
          ? this.calculateNextDate(currentDate, recurring.frequency)
          : startOfDay(recurring.startDate); // Primeira transação usa startDate diretamente

        // Parar se a próxima data for no futuro
        if (isAfter(nextDate, today)) {
          break;
        }

        // Verificar se está dentro do período ativo
        if (
          !recurring.endDate ||
          isBefore(nextDate, recurring.endDate) ||
          nextDate.getTime() === recurring.endDate.getTime()
        ) {
          await this.createExpenseFromRecurring(recurring, nextDate);
          created++;
          currentDate = nextDate;

          // Após criar a primeira, atualizar lastDate para continuar o loop
          if (!lastDate) {
            lastDate = nextDate;
          }
        } else {
          // Desativar se passou da data final
          await this.recurringRepository.update(recurring.id!, {
            isActive: false,
          });
          break;
        }
      }
    }

    return created;
  }

  /**
   * Cria uma transação a partir de uma recorrência
   */
  private async createExpenseFromRecurring(
    recurring: RecurringExpense,
    date: Date
  ): Promise<void> {
    const expense = Expense.create({
      amount: recurring.amount,
      date,
      emotionId: recurring.emotionId,
      categoryId: recurring.categoryId,
      note: recurring.note + " (Recorrente)",
      userId: recurring.userId,
      type: recurring.type,
    });

    await this.expenseRepository.create(expense);
  }

  /**
   * Calcula a próxima data baseada na frequência
   */
  private calculateNextDate(currentDate: Date, frequency: string): Date {
    switch (frequency) {
      case "daily":
        return addDays(currentDate, 1);
      case "weekly":
        return addWeeks(currentDate, 1);
      case "monthly":
        return addMonths(currentDate, 1);
      case "yearly":
        return addYears(currentDate, 1);
      default:
        return currentDate;
    }
  }

  /**
   * Busca a última transação criada por esta recorrência
   */
  private async getLastCreatedDate(
    recurring: RecurringExpense
  ): Promise<Date | null> {
    const allExpenses = await this.expenseRepository.findAll();

    // Filtra transações que correspondem à recorrência
    const matchingExpenses = allExpenses.filter(
      (e) =>
        e.amount === recurring.amount &&
        e.emotionId === recurring.emotionId &&
        e.categoryId === recurring.categoryId &&
        e.type === recurring.type &&
        e.note.includes("(Recorrente)")
    );

    if (matchingExpenses.length === 0) return null;

    // Retorna a data mais recente
    return matchingExpenses.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )[0].date;
  }
}
