export class TransactionResult {
  status: boolean;
  data: any;

  constructor(status: boolean, data: unknown) {
    this.status = status;
    this.data = data;
  }
}
