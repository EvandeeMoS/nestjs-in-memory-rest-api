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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TransferResult } from './dto/transfer-result.dto';
import { Transfer } from './entities/transfer.entity';

@Controller('transfer')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  // @Post()
  // create(@Body() createTransactionDto: CreateTransferDto) {
  //   return this.transfersService.create(createTransactionDto);
  // }

  @Post()
  @ApiCreatedResponse({
    type: TransferResult,
    description: 'The transfer was succefully created',
  })
  @ApiBadRequestResponse({
    description:
      "Bad Request. Payer can't be the same as the payee, and the value can't be less or equal to 0 neither higher than the amount in the payer wallet",
  })
  @ApiNotFoundResponse({
    description: 'Not Found. The payer, payee or payer wallet was not found',
  })
  newTransfer(@Body(ValidationPipe) data: DataTransferDto) {
    return this.transfersService.newTransfer(data);
  }

  @Get()
  @ApiOkResponse({
    type: Transfer,
    isArray: true,
    description: 'Return all transfers',
  })
  findAll() {
    return this.transfersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Transfer,
    description: 'Return a transfer with the passed id',
  })
  @ApiNotFoundResponse({
    description: "Not found. A transfer with the passed id doesn't exist",
  })
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Patch(':id')
  @ApiNotFoundResponse({
    description: "Not found. A transfer with the passed id doesn't exist",
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTransactionDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({
    description: "Not found. A transfer with the passed id doesn't exist",
  })
  remove(@Param('id') id: string) {
    return this.transfersService.remove(id);
  }
}
