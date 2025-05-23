import { IsNotEmpty, Min } from 'class-validator';

export class DataTransferDto {
  @Min(0.01)
  value: number;
  @IsNotEmpty()
  payer: string;
  @IsNotEmpty()
  payee: string;
}
