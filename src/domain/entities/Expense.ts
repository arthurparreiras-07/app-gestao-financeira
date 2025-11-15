export type TransactionType = "expense" | "saving";

export class Expense {
  constructor(
    public readonly id: number | null,
    public readonly amount: number,
    public readonly date: Date,
    public readonly emotionId: number,
    public readonly categoryId: number,
    public readonly note: string,
    public readonly userId: number,
    public readonly type: TransactionType = "expense",
    public readonly attachments: string[] = []
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.amount <= 0) {
      throw new Error("O valor deve ser positivo");
    }
    if (!this.emotionId || !this.categoryId) {
      throw new Error("Emoção e categoria são obrigatórias");
    }
    if (this.type !== "expense" && this.type !== "saving") {
      throw new Error('Tipo deve ser "expense" ou "saving"');
    }
  }

  static create(data: {
    amount: number;
    date: Date;
    emotionId: number;
    categoryId: number;
    note: string;
    userId: number;
    type?: TransactionType;
    attachments?: string[];
  }): Expense {
    return new Expense(
      null,
      data.amount,
      data.date,
      data.emotionId,
      data.categoryId,
      data.note,
      data.userId,
      data.type || "expense",
      data.attachments || []
    );
  }
}
