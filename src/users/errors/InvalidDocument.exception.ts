import { HttpException } from "@nestjs/common";

export class InvalidDocumentException extends HttpException {
    constructor(response: string) {
        super(response, 400)
    }
}