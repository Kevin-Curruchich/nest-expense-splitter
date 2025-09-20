export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: Date;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  createdAt: Date;
}

export interface Balance {
  member: string;
  balance: number; // positive means they are owed money, negative means they owe money
}

export interface GroupBalance {
  groupId: string;
  balances: Balance[];
}