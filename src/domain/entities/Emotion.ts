export class Emotion {
constructor(
  public readonly id: number | null,
  public readonly name: string,
  public readonly intensity: number,
  public readonly icon: string
) {}

static getDefaultEmotions(): Omit<Emotion, 'id'>[] {
  return [
    { name: 'Feliz', intensity: 5, icon: '😊', id: null },
    { name: 'Triste', intensity: 3, icon: '😢', id: null },
    { name: 'Estressado', intensity: 4, icon: '😰', id: null },
    { name: 'Entediado', intensity: 2, icon: '😐', id: null },
    { name: 'Animado', intensity: 5, icon: '🤩', id: null },
    { name: 'Ansioso', intensity: 4, icon: '😟', id: null },
    { name: 'Calmo', intensity: 1, icon: '😌', id: null },
  ];
}
}