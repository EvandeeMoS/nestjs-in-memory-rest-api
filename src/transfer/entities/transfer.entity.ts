export class Transfer {
    id: string;
    value: number;
    payer: string;
    payee: string;
    createdAt: Date;
    doneAt: Date | null;
    status: "PENDING" | "DONE" | "CANCELED"
}
