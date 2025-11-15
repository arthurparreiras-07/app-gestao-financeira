export type Frequency = "daily" | "weekly" | "monthly" | "yearly";

export class RecurringExpense {
  constructor(
    public readonly id: number | null,
    public readonly frequency: Frequency,
    public readonly amount: number,
    public readonly emotionId: number,
    public readonly categoryId: number,
    public readonly note: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly isActive: boolean,
    public readonly userId: number,
    public readonly type: "expense" | "saving"
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.amount <= 0) {
      throw new Error("O valor deve ser positivo");
    }
    if (this.endDate && this.endDate < this.startDate) {
      throw new Error("Data final deve ser maior que data inicial");
    }
  }

  static create(data: {
    frequency: Frequency;
    amount: number;
    emotionId: number;
    categoryId: number;
    note: string;
    startDate: Date;
    endDate?: Date | null;
    userId: number;
    type: "expense" | "saving";
  }): RecurringExpense {
    return new RecurringExpense(
      null,
      data.frequency,
      data.amount,
      data.emotionId,
      data.categoryId,
      data.note,
      data.startDate,
      data.endDate || null,
      true,
      data.userId,
      data.type
    );
  }
}
