import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class DataTransferDto {
  @ApiProperty({
    description: 'The value to transfer',
    type: Number,
    minimum: 0.01,
  })
  @Min(0.01)
  value: number;
  @ApiProperty({
    description: 'The id of the payer',
    type: String,
  })
  @IsNotEmpty()
  payer: string;
  @ApiProperty({
    description: 'The id of the payee',
    type: String,
  })
  @IsNotEmpty()
  payee: string;
}
