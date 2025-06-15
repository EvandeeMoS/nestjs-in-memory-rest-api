import { PartialType } from '@nestjs/swagger';
import { CreateTransferDto } from './create-tranfer.dto';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {}
