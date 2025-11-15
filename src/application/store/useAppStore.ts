import { create } from "zustand";
import { Expense, TransactionType } from "../../domain/entities/Expense";
import { Emotion } from "../../domain/entities/Emotion";
import { Category } from "../../domain/entities/Category";
import { Budget } from "../../domain/entities/Budget";
import { RecurringExpense } from "../../domain/entities/RecurringExpense";
import { Tag } from "../../domain/entities/Tag";
import { ExpenseRepository } from "../../infrastructure/repositories/ExpenseRepository";
import { EmotionRepository } from "../../infrastructure/repositories/EmotionRepository";
import { CategoryRepository } from "../../infrastructure/repositories/CategoryRepository";
import { BudgetRepository } from "../../infrastructure/repositories/BudgetRepository";
import { RecurringExpenseRepository } from "../../infrastructure/repositories/RecurringExpenseRepository";
import { TagRepository } from "../../infrastructure/repositories/TagRepository";
import { Insight, InsightsService } from "../services/InsightsService";
import { RecurringExpenseService } from "../services/RecurringExpenseService";
import { ExportService } from "../services/ExportService";

interface AppState {
  expenses: Expense[];
  emotions: Emotion[];
  categories: Category[];
  budgets: Budget[];
  recurringExpenses: RecurringExpense[];
  tags: Tag[];
  insights: Insight[];
  loading: boolean;

  // Repositories
  expenseRepository: ExpenseRepository;
  emotionRepository: EmotionRepository;
  categoryRepository: CategoryRepository;
  budgetRepository: BudgetRepository;
  recurringExpenseRepository: RecurringExpenseRepository;
  tagRepository: TagRepository;
  insightsService: InsightsService;
  recurringExpenseService: RecurringExpenseService;
  exportService: ExportService;

  // Expense Actions
  loadData: () => Promise<void>;
  addExpense: (data: {
    amount: number;
    date: Date;
    emotionId: number;
    categoryId: number;
    note: string;
    type?: TransactionType;
    attachments?: string[];
    tagIds?: number[];
  }) => Promise<void>;
  updateExpense: (id: number, data: Partial<{
    amount: number;
    date: Date;
    emotionId: number;
    categoryId: number;
    note: string;
    type: TransactionType;
    attachments: string[];
    tagIds: number[];
  }>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  
  // Budget Actions
  addBudget: (data: {
    categoryId: number | null;
    monthlyLimit: number;
    month: number;
    year: number;
    alertThreshold?: number;
  }) => Promise<void>;
  updateBudget: (id: number, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  getBudgetProgress: (budgetId: number) => { spent: number; limit: number; percentage: number };
  
  // Recurring Expense Actions
  addRecurringExpense: (data: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    amount: number;
    emotionId: number;
    categoryId: number;
    note: string;
    startDate: Date;
    endDate?: Date | null;
    type: 'expense' | 'saving';
  }) => Promise<void>;
  updateRecurringExpense: (id: number, data: Partial<RecurringExpense>) => Promise<void>;
  deleteRecurringExpense: (id: number) => Promise<void>;
  processRecurringExpenses: () => Promise<void>;
  
  // Tag Actions
  addTag: (data: { name: string; color: string }) => Promise<void>;
  updateTag: (id: number, data: Partial<Tag>) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  addTagToExpense: (expenseId: number, tagId: number) => Promise<void>;
  removeTagFromExpense: (expenseId: number, tagId: number) => Promise<void>;
  
  // Export Actions
  exportToCSV: () => Promise<void>;
  exportToJSON: () => Promise<void>;
  exportReport: () => Promise<void>;
  
  // Utility Actions
  refreshInsights: () => void;
  clearAllData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  expenses: [],
  emotions: [],
  categories: [],
  budgets: [],
  recurringExpenses: [],
  tags: [],
  insights: [],
  loading: false,

  expenseRepository: new ExpenseRepository(),
  emotionRepository: new EmotionRepository(),
  categoryRepository: new CategoryRepository(),
  budgetRepository: new BudgetRepository(),
  recurringExpenseRepository: new RecurringExpenseRepository(),
  tagRepository: new TagRepository(),
  insightsService: new InsightsService(),
  recurringExpenseService: new RecurringExpenseService(
    new RecurringExpenseRepository(),
    new ExpenseRepository()
  ),
  exportService: new ExportService(),

  loadData: async () => {
    set({ loading: true });
    try {
      const {
        expenseRepository,
        emotionRepository,
        categoryRepository,
        budgetRepository,
        recurringExpenseRepository,
        tagRepository,
      } = get();

      const [expenses, emotions, categories, budgets, recurringExpenses, tags] =
        await Promise.all([
          expenseRepository.findAll(),
          emotionRepository.findAll(),
          categoryRepository.findAll(),
          budgetRepository.findAll(),
          recurringExpenseRepository.findAll(),
          tagRepository.findAll(),
        ]);

      set({ expenses, emotions, categories, budgets, recurringExpenses, tags });
      get().refreshInsights();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      set({ loading: false });
    }
  },

  addExpense: async (data) => {
    const { expenseRepository } = get();
    const expense = Expense.create({ ...data, userId: 1 });
    await expenseRepository.create(expense);
    await get().loadData();
  },

  updateExpense: async (id, data) => {
    const { expenseRepository } = get();
    await expenseRepository.update(id, data);
    await get().loadData();
  },

  deleteExpense: async (id) => {
    const { expenseRepository } = get();
    await expenseRepository.delete(id);
    await get().loadData();
  },

  // Budget Actions
  addBudget: async (data) => {
    const { budgetRepository } = get();
    const budget = Budget.create({ 
      ...data, 
      alertThreshold: data.alertThreshold ?? 80,
      userId: 1 
    });
    await budgetRepository.create(budget);
    await get().loadData();
  },

  updateBudget: async (id, data) => {
    const { budgetRepository } = get();
    await budgetRepository.update(id, data);
    await get().loadData();
  },

  deleteBudget: async (id) => {
    const { budgetRepository } = get();
    await budgetRepository.delete(id);
    await get().loadData();
  },

  getBudgetProgress: (budgetId) => {
    const { budgets, expenses } = get();
    const budget = budgets.find((b) => b.id === budgetId);
    
    if (!budget) {
      return { spent: 0, limit: 0, percentage: 0 };
    }

    const budgetExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      const matchesMonth = expenseDate.getMonth() + 1 === budget.month;
      const matchesYear = expenseDate.getFullYear() === budget.year;
      const matchesCategory = budget.categoryId
        ? e.categoryId === budget.categoryId
        : true;
      const isExpense = e.type === 'expense';
      
      return matchesMonth && matchesYear && matchesCategory && isExpense;
    });

    const spent = budgetExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (spent / budget.monthlyLimit) * 100;

    return { spent, limit: budget.monthlyLimit, percentage };
  },

  // Recurring Expense Actions
  addRecurringExpense: async (data) => {
    const { recurringExpenseRepository } = get();
    const recurringExpense = RecurringExpense.create({ ...data, userId: 1 });
    await recurringExpenseRepository.create(recurringExpense);
    await get().loadData();
  },

  updateRecurringExpense: async (id, data) => {
    const { recurringExpenseRepository } = get();
    await recurringExpenseRepository.update(id, data);
    await get().loadData();
  },

  deleteRecurringExpense: async (id) => {
    const { recurringExpenseRepository } = get();
    await recurringExpenseRepository.delete(id);
    await get().loadData();
  },

  processRecurringExpenses: async () => {
    const { recurringExpenseService } = get();
    await recurringExpenseService.processRecurringExpenses();
    await get().loadData();
  },

  // Tag Actions
  addTag: async (data) => {
    const { tagRepository } = get();
    const tag = Tag.create({ ...data, userId: 1 });
    await tagRepository.create(tag);
    await get().loadData();
  },

  updateTag: async (id, data) => {
    const { tagRepository } = get();
    await tagRepository.update(id, data);
    await get().loadData();
  },

  deleteTag: async (id) => {
    const { tagRepository } = get();
    await tagRepository.delete(id);
    await get().loadData();
  },

  addTagToExpense: async (expenseId, tagId) => {
    const { tagRepository } = get();
    await tagRepository.addTagToExpense(expenseId, tagId);
    await get().loadData();
  },

  removeTagFromExpense: async (expenseId, tagId) => {
    const { tagRepository } = get();
    await tagRepository.removeTagFromExpense(expenseId, tagId);
    await get().loadData();
  },

  // Export Actions
  exportToCSV: async () => {
    const { exportService, expenses, categories, emotions } = get();
    await exportService.exportToCSV(expenses, categories, emotions);
  },

  exportToJSON: async () => {
    const { exportService, expenses, categories, emotions } = get();
    await exportService.exportToJSON({ expenses, categories, emotions });
  },

  exportReport: async () => {
    const { exportService, expenses, categories, emotions } = get();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    await exportService.exportReport(expenses, categories, emotions, {
      start: startOfMonth,
      end: endOfMonth,
    });
  },

  refreshInsights: () => {
    const { expenses, emotions, insightsService } = get();
    const insights = insightsService.generateInsights(expenses, emotions);
    set({ insights });
  },

  clearAllData: async () => {
    const { expenseRepository } = get();
    const expenses = await expenseRepository.findAll();
    for (const expense of expenses) {
      if (expense.id) {
        await expenseRepository.delete(expense.id);
      }
    }
    await get().loadData();
  },
}));
