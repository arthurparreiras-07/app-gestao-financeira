export class Budget {
  constructor(
    public readonly id: number | null,
    public readonly categoryId: number | null, // null = orçamento geral
    public readonly monthlyLimit: number,
    public readonly month: number, // 1-12
    public readonly year: number,
    public readonly alertThreshold: number, // 0-100 (porcentagem)
    public readonly userId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.monthlyLimit <= 0) {
      throw new Error("O limite mensal deve ser positivo");
    }
    if (this.month < 1 || this.month > 12) {
      throw new Error("Mês deve estar entre 1 e 12");
    }
    if (this.alertThreshold < 0 || this.alertThreshold > 100) {
      throw new Error("Threshold deve estar entre 0 e 100");
    }
  }

  static create(data: {
    categoryId: number | null;
    monthlyLimit: number;
    month: number;
    year: number;
    alertThreshold: number;
    userId: number;
  }): Budget {
    return new Budget(
      null,
      data.categoryId,
      data.monthlyLimit,
      data.month,
      data.year,
      data.alertThreshold,
      data.userId
    );
  }
}
