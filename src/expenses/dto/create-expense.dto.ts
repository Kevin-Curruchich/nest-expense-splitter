import { IsString, IsNumber, IsArray, ArrayMinSize, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  groupId: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  paidBy: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  splitAmong: string[];
}