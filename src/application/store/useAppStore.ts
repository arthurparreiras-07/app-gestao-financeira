import { create } from "zustand";
import { Expense, TransactionType } from "../../domain/entities/Expense";
import { Emotion } from "../../domain/entities/Emotion";
import { Category } from "../../domain/entities/Category";
import { ExpenseRepository } from "../../infrastructure/repositories/ExpenseRepository";
import { EmotionRepository } from "../../infrastructure/repositories/EmotionRepository";
import { CategoryRepository } from "../../infrastructure/repositories/CategoryRepository";
import { Insight, InsightsService } from "../services/InsightsService";

interface AppState {
  expenses: Expense[];
  emotions: Emotion[];
  categories: Category[];
  insights: Insight[];
  loading: boolean;

  // Repositories
  expenseRepository: ExpenseRepository;
  emotionRepository: EmotionRepository;
  categoryRepository: CategoryRepository;
  insightsService: InsightsService;

  // Actions
  loadData: () => Promise<void>;
  addExpense: (data: {
    amount: number;
    date: Date;
    emotionId: number;
    categoryId: number;
    note: string;
    type?: TransactionType;
  }) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  refreshInsights: () => void;
  clearAllData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  expenses: [],
  emotions: [],
  categories: [],
  insights: [],
  loading: false,

  expenseRepository: new ExpenseRepository(),
  emotionRepository: new EmotionRepository(),
  categoryRepository: new CategoryRepository(),
  insightsService: new InsightsService(),

  loadData: async () => {
    set({ loading: true });
    try {
      const { expenseRepository, emotionRepository, categoryRepository } =
        get();

      const [expenses, emotions, categories] = await Promise.all([
        expenseRepository.findAll(),
        emotionRepository.findAll(),
        categoryRepository.findAll(),
      ]);

      set({ expenses, emotions, categories });
      get().refreshInsights();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      set({ loading: false });
    }
  },

  addExpense: async (data) => {
    const { expenseRepository } = get();
    await expenseRepository.create(Expense.create({ ...data, userId: 1 }));
    await get().loadData();
  },

  deleteExpense: async (id) => {
    const { expenseRepository } = get();
    await expenseRepository.delete(id);
    await get().loadData();
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
