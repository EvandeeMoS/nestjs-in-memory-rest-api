import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The initial amount in the wallet',
    type: Number,
    minimum: 0,
  })
  @Min(0)
  value: number;
}
