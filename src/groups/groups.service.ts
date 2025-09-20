import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryStorageService } from '../common/memory-storage.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from '../common/interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupsService {
  constructor(private readonly storageService: MemoryStorageService) {}

  create(createGroupDto: CreateGroupDto): Group {
    const group: Group = {
      id: uuidv4(),
      name: createGroupDto.name,
      description: createGroupDto.description,
      members: createGroupDto.members,
      createdAt: new Date(),
    };

    return this.storageService.createGroup(group);
  }

  findAll(): Group[] {
    return this.storageService.getAllGroups();
  }

  findOne(id: string): Group {
    const group = this.storageService.getGroup(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }
}