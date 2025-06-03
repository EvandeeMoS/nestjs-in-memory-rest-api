import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The amount to transfer',
    minimum: 0,
  })
  @Min(0)
  value: number;
}
