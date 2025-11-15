export class User {
constructor(
  public readonly id: number | null,
  public readonly name: string,
  public readonly preferences: Record<string, any>
) {}
}