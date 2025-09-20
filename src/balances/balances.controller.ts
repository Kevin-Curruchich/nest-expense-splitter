import { Controller, Get, Param, Query } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('group/:groupId')
  getGroupBalance(@Param('groupId') groupId: string) {
    return this.balancesService.calculateGroupBalance(groupId);
  }

  @Get('group/:groupId/settlements')
  getSettlementSuggestions(@Param('groupId') groupId: string) {
    return this.balancesService.getSettlementSuggestions(groupId);
  }

  @Get()
  getAllBalances() {
    return this.balancesService.calculateAllBalances();
  }
}