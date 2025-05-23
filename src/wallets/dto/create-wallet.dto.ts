import { Min } from 'class-validator';

export class CreateWalletDto {
  @Min(0.01)
  value: number;
}
