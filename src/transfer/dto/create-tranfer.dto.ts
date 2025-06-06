import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    description: 'The amount to transfer',
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
  @ApiPropertyOptional({
    description: 'The date of creation of the Transfer',
    type: Date,
    default: 'new Date()',
  })
  createdAt: Date = new Date();
  @ApiPropertyOptional({
    description: 'The date of completion of the Transfer',
    type: Date || null,
    default: null,
  })
  doneAt: Date | null;
  @ApiPropertyOptional({
    description: 'The state of the Transfer',
    default: 'PENDING',
    enum: { PENDING: 'PENDING', DONE: 'DONE', CANCELED: 'CANCELLED' },
  })
  @IsEnum({ PENDING: 'PENDING', DONE: 'DONE', CANCELED: 'CANCELLED' })
  status: 'PENDING' | 'DONE' | 'CANCELLED' = 'PENDING';
}
