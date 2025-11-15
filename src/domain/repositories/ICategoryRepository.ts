import { Category } from '../entities/Category';

export interface ICategoryRepository {
create(category: Category): Promise<number>;
findAll(): Promise<Category[]>;
findById(id: number): Promise<Category | null>;
}