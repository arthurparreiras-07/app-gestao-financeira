import { Tag, ExpenseTag } from '../entities/Tag';

export interface ITagRepository {
  create(tag: Tag): Promise<number>;
  findAll(): Promise<Tag[]>;
  update(id: number, tag: Partial<Tag>): Promise<void>;
  delete(id: number): Promise<void>;
  
  // Relacionamentos
  addTagToExpense(expenseId: number, tagId: number): Promise<void>;
  removeTagFromExpense(expenseId: number, tagId: number): Promise<void>;
  findTagsByExpense(expenseId: number): Promise<Tag[]>;
  findExpensesByTag(tagId: number): Promise<number[]>;
}
