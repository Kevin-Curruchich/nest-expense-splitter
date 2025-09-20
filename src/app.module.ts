import { Module } from '@nestjs/common';
import { GroupsModule } from './groups/groups.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BalancesModule } from './balances/balances.module';
import { MemoryStorageModule } from './common/memory-storage.module';

@Module({
  imports: [
    MemoryStorageModule,
    GroupsModule,
    ExpensesModule,
    BalancesModule,
  ],
})
export class AppModule {}