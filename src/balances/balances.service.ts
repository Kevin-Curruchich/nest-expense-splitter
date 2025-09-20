import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryStorageService } from '../common/memory-storage.service';
import { GroupBalance, Balance } from '../common/interfaces';

@Injectable()
export class BalancesService {
  constructor(private readonly storageService: MemoryStorageService) {}

  calculateGroupBalance(groupId: string): GroupBalance {
    // Validate that the group exists
    if (!this.storageService.groupExists(groupId)) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const group = this.storageService.getGroup(groupId);
    const expenses = this.storageService.getExpensesByGroup(groupId);

    // Initialize balances for all members
    const balances: { [member: string]: number } = {};
    group.members.forEach(member => {
      balances[member] = 0;
    });

    // Calculate balances based on expenses
    expenses.forEach(expense => {
      const sharePerPerson = expense.amount / expense.splitAmong.length;
      
      // The person who paid gets credited
      balances[expense.paidBy] += expense.amount;
      
      // Everyone who the expense is split among gets debited
      expense.splitAmong.forEach(member => {
        balances[member] -= sharePerPerson;
      });
    });

    // Convert to Balance array
    const balanceArray: Balance[] = Object.entries(balances).map(([member, balance]) => ({
      member,
      balance: Math.round(balance * 100) / 100, // Round to 2 decimal places
    }));

    return {
      groupId,
      balances: balanceArray,
    };
  }

  calculateAllBalances(): GroupBalance[] {
    const allGroups = this.storageService.getAllGroups();
    return allGroups.map(group => this.calculateGroupBalance(group.id));
  }

  getSettlementSuggestions(groupId: string): Array<{ from: string; to: string; amount: number }> {
    const groupBalance = this.calculateGroupBalance(groupId);
    const settlements: Array<{ from: string; to: string; amount: number }> = [];

    // Separate debtors (negative balance) and creditors (positive balance)
    const debtors = groupBalance.balances
      .filter(balance => balance.balance < 0)
      .map(balance => ({ member: balance.member, amount: Math.abs(balance.balance) }))
      .sort((a, b) => b.amount - a.amount);

    const creditors = groupBalance.balances
      .filter(balance => balance.balance > 0)
      .map(balance => ({ member: balance.member, amount: balance.balance }))
      .sort((a, b) => b.amount - a.amount);

    // Create settlement suggestions
    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];

      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      if (settlementAmount > 0.01) { // Only suggest settlements for amounts > 1 cent
        settlements.push({
          from: debtor.member,
          to: creditor.member,
          amount: Math.round(settlementAmount * 100) / 100,
        });
      }

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount < 0.01) debtorIndex++;
      if (creditor.amount < 0.01) creditorIndex++;
    }

    return settlements;
  }
}