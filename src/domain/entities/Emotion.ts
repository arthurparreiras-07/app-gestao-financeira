export class Emotion {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly intensity: number,
    public readonly icon: string
  ) {}

  static getDefaultEmotions(): Omit<Emotion, "id">[] {
    return [
      { name: "Feliz", intensity: 5, icon: "happy" },
      { name: "Triste", intensity: 3, icon: "sad" },
      { name: "Estressado", intensity: 4, icon: "fitness" },
      { name: "Entediado", intensity: 2, icon: "remove-circle" },
      { name: "Animado", intensity: 5, icon: "star" },
      { name: "Ansioso", intensity: 4, icon: "warning" },
      { name: "Calmo", intensity: 1, icon: "leaf" },
    ];
  }
}
