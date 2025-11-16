export class Category {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly icon: string,
    public readonly color: string
  ) {}

  static getDefaultCategories(): Omit<Category, "id">[] {
    return [
      { name: "Alimentação", icon: "fast-food", color: "#FF6B6B" },
      { name: "Transporte", icon: "car", color: "#4ECDC4" },
      { name: "Entretenimento", icon: "game-controller", color: "#FFE66D" },
      { name: "Compras", icon: "cart", color: "#95E1D3" },
      { name: "Saúde", icon: "medical", color: "#F38181" },
      { name: "Educação", icon: "school", color: "#AA96DA" },
      { name: "Outros", icon: "ellipsis-horizontal", color: "#FCBAD3" },
    ];
  }
}
