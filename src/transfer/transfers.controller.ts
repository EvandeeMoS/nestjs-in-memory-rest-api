import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { DataTransferDto } from './dto/data-transfer.dto';

@Controller('transfer')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  // @Post()
  // create(@Body() createTransactionDto: CreateTransferDto) {
  //   return this.transfersService.create(createTransactionDto);
  // }

  @Post()
  newTransaction(@Body(ValidationPipe) data: DataTransferDto) {
    return this.transfersService.newTransaction(data);
  }

  @Get()
  findAll() {
    return this.transfersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTransactionDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transfersService.remove(id);
  }
}
