export class Transfer {
  id: string;
  value: number;
  payer: string;
  payee: string;
  createdAt: Date;
  doneAt: Date | null;
  status: 'PENDING' | 'DONE' | 'CANCELED';

  constructor(
    id: string,
    value: number,
    payer: string,
    payee: string,
    createdAt: Date,
    doneAt: Date | null,
    status: 'PENDING' | 'DONE' | 'CANCELED',
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
