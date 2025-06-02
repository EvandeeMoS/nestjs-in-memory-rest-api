import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "./user-type.enum";

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  document: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  walletId: string;
  @ApiProperty()
  type: UserType;

  constructor(
    id: string,
    fullName: string,
    document: string,
    email: string,
    password: string,
    walletId: string,
    type: UserType
  ) {
    this.id = id;
    this.fullName = fullName;
    this.document = document;
    this.email = email;
    this.password = password;
    this.walletId = walletId;
    this.type = type;
  }
}
