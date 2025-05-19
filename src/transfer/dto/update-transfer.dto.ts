import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferDto } from './create-tranfer.dto';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {}
