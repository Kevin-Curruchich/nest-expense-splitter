import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MemoryStorageService } from '../common/memory-storage.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../common/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExpensesService {
  constructor(private readonly storageService: MemoryStorageService) {}

  create(createExpenseDto: CreateExpenseDto): Expense {
    // Validate that the group exists
    if (!this.storageService.groupExists(createExpenseDto.groupId)) {
      throw new NotFoundException(`Group with ID ${createExpenseDto.groupId} not found`);
    }

    // Get the group to validate members
    const group = this.storageService.getGroup(createExpenseDto.groupId);
    
    // Validate that paidBy is a member of the group
    if (!group.members.includes(createExpenseDto.paidBy)) {
      throw new BadRequestException(`User ${createExpenseDto.paidBy} is not a member of the group`);
    }

    // Validate that all splitAmong members are in the group
    const invalidMembers = createExpenseDto.splitAmong.filter(
      member => !group.members.includes(member)
    );
    if (invalidMembers.length > 0) {
      throw new BadRequestException(`Users ${invalidMembers.join(', ')} are not members of the group`);
    }

    const expense: Expense = {
      id: uuidv4(),
      groupId: createExpenseDto.groupId,
      description: createExpenseDto.description,
      amount: createExpenseDto.amount,
      paidBy: createExpenseDto.paidBy,
      splitAmong: createExpenseDto.splitAmong,
      createdAt: new Date(),
    };

    return this.storageService.createExpense(expense);
  }

  findByGroup(groupId: string): Expense[] {
    // Validate that the group exists
    if (!this.storageService.groupExists(groupId)) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return this.storageService.getExpensesByGroup(groupId);
  }

  findOne(id: string): Expense {
    const expense = this.storageService.getExpense(id);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }
}