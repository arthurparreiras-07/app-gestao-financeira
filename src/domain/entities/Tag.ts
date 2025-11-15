export class Tag {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly color: string,
    public readonly userId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Nome da tag é obrigatório");
    }
    if (!this.color.match(/^#[0-9A-F]{6}$/i)) {
      throw new Error("Cor deve estar no formato hexadecimal");
    }
  }

  static create(data: {
    name: string;
    color: string;
    userId: number;
  }): Tag {
    return new Tag(null, data.name, data.color, data.userId);
  }
}

// Tabela de relacionamento muitos-para-muitos
export interface ExpenseTag {
  expenseId: number;
  tagId: number;
}
