import { ApiProperty } from '@nestjs/swagger';

export class Wallet {
  @ApiProperty()
  id: string;
  @ApiProperty()
  value: number;

  constructor(id: string, value: number) {
    this.id = id;
    this.value = value;
  }
}
