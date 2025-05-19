export class CreateTransferDto {
    value: number;
    payer: string;
    payee: string;
    createdAt: Date = new Date();
    doneAt: Date | null;
    status: "PENDING" | "DONE" | "CANCELED" = 'PENDING'
}
