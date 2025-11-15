export class Category {
constructor(
  public readonly id: number | null,
  public readonly name: string,
  public readonly icon: string,
  public readonly color: string
) {}

static getDefaultCategories(): Omit<Category, 'id'>[] {
  return [
    { name: 'Alimentação', icon: '🍔', color: '#FF6B6B', id: null },
    { name: 'Transporte', icon: '🚗', color: '#4ECDC4', id: null },
    { name: 'Entretenimento', icon: '🎮', color: '#FFE66D', id: null },
    { name: 'Compras', icon: '🛍️', color: '#95E1D3', id: null },
    { name: 'Saúde', icon: '💊', color: '#F38181', id: null },
    { name: 'Educação', icon: '📚', color: '#AA96DA', id: null },
    { name: 'Outros', icon: '💰', color: '#FCBAD3', id: null },
  ];
}
}