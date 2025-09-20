import { Injectable } from '@nestjs/common';
import { Group, Expense } from './interfaces';

@Injectable()
export class MemoryStorageService {
  private groups: Map<string, Group> = new Map();
  private expenses: Map<string, Expense> = new Map();

  // Group operations
  createGroup(group: Group): Group {
    this.groups.set(group.id, group);
    return group;
  }

  getGroup(id: string): Group | undefined {
    return this.groups.get(id);
  }

  getAllGroups(): Group[] {
    return Array.from(this.groups.values());
  }

  groupExists(id: string): boolean {
    return this.groups.has(id);
  }

  // Expense operations
  createExpense(expense: Expense): Expense {
    this.expenses.set(expense.id, expense);
    return expense;
  }

  getExpense(id: string): Expense | undefined {
    return this.expenses.get(id);
  }

  getExpensesByGroup(groupId: string): Expense[] {
    return Array.from(this.expenses.values()).filter(
      expense => expense.groupId === groupId
    );
  }

  getAllExpenses(): Expense[] {
    return Array.from(this.expenses.values());
  }

  // Clear storage (useful for testing)
  clear(): void {
    this.groups.clear();
    this.expenses.clear();
  }
}