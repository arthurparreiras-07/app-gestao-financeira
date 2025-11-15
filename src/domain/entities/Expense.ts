export class Expense {
constructor(
  public readonly id: number | null,
  public readonly amount: number,
  public readonly date: Date,
  public readonly emotionId: number,
  public readonly categoryId: number,
  public readonly note: string,
  public readonly userId: number
) {
  this.validate();
}

private validate(): void {
  if (this.amount <= 0) {
    throw new Error('O valor deve ser positivo');
  }
  if (!this.emotionId || !this.categoryId) {
    throw new Error('Emoção e categoria são obrigatórias');
  }
}

static create(data: {
  amount: number;
  date: Date;
  emotionId: number;
  categoryId: number;
  note: string;
  userId: number;
}): Expense {
  return new Expense(
    null,
    data.amount,
    data.date,
    data.emotionId,
    data.categoryId,
    data.note,
    data.userId
  );
}
}