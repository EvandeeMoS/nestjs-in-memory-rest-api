import { ApiProperty } from '@nestjs/swagger';

export class Transfer {
  @ApiProperty()
  id: string;
  @ApiProperty()
  value: number;
  @ApiProperty()
  payer: string;
  @ApiProperty()
  payee: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  doneAt: Date | null;
  @ApiProperty({
    enum: { PENDING: 'PENDING', DONE: 'DONE', CANCELLED: 'CANCELLED' },
  })
  status: 'PENDING' | 'DONE' | 'CANCELLED';

  constructor(
    id: string,
    value: number,
    payer: string,
    payee: string,
    createdAt: Date,
    doneAt: Date | null,
    status: 'PENDING' | 'DONE' | 'CANCELLED',
  ) {
    this.id = id;
    this.value = value;
    this.payer = payer;
    this.payee = payee;
    this.createdAt = createdAt;
    this.doneAt = doneAt;
    this.status = status;
  }
}
