import { IsEnum, IsNotEmpty, Min } from 'class-validator';

export class CreateTransferDto {
  @Min(0.01)
  value: number;
  @IsNotEmpty()
  payer: string;
  @IsNotEmpty()
  payee: string;
  createdAt: Date = new Date();
  doneAt: Date | null;
  @IsEnum({ PENDING: 'PENDING', DONE: 'DONE', CANCELED: 'CANCELED' })
  status: 'PENDING' | 'DONE' | 'CANCELED' = 'PENDING';
}
