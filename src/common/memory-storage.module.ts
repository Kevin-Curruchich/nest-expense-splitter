import { Module, Global } from '@nestjs/common';
import { MemoryStorageService } from './memory-storage.service';

@Global()
@Module({
  providers: [MemoryStorageService],
  exports: [MemoryStorageService],
})
export class MemoryStorageModule {}