import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    description: 'The amount to transfer',
    minimum: 0.01,
  })
  @Min(0.01)
  value: number;
  @ApiProperty({
    description: 'The one who pays',
  })
  @IsNotEmpty()
  payer: string;
  @ApiProperty({
    description: 'The one who recieve',
  })
  @IsNotEmpty()
  payee: string;
  @ApiPropertyOptional({
    description: 'Date that the transfer is created',
    default: 'new Date()',
  })
  createdAt: Date = new Date();
  @ApiPropertyOptional({
    description: 'Date that the transfer is done',
  })
  doneAt: Date | null;
  @ApiPropertyOptional({
    description: 'Status of the transfer, could be Created, Pending or Done',
    enum: { PENDING: 'PENDING', DONE: 'DONE', CANCELED: 'CANCELLED' },
  })
  @IsEnum({ PENDING: 'PENDING', DONE: 'DONE', CANCELED: 'CANCELLED' })
  status: 'PENDING' | 'DONE' | 'CANCELLED' = 'PENDING';
}
