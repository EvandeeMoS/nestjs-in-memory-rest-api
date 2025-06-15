export class TransferResult {
  status: number;
  data: unknown;
  authorization: boolean;
  notification: boolean;

  constructor(
    status: number,
    data: unknown,
    authorization: boolean,
  ) {
    this.status = status;
    this.data = data;
    this.authorization = authorization;
  }
}
