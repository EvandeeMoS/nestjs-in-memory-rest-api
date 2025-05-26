import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class DataTransferDto {
  @ApiProperty({
    description: "The amount to transfer",
    minimum: 0.01
  })
  @Min(0.01)
  value: number;
  @ApiProperty({
    description: "The one who pays"
  })
  @IsNotEmpty()
  payer: string;
  @ApiProperty({
    description: "The one who recieve"
  })
  @IsNotEmpty()
  payee: string;
}
