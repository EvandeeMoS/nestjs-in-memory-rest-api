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
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Wallet } from './entities/wallet.entity';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiOkResponse({
    description: 'The list of all wallets',
    type: Wallet,
    isArray: true,
  })
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The wallet with the id passed', type: Wallet })
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The wallet was succefuly created',
    type: Wallet,
  })
  create(@Body(ValidationPipe) createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @Patch('deposit/:id')
  @ApiOkResponse({
    description: 'The deposit was succefully done',
    type: Wallet,
  })
  @ApiBadRequestResponse({ description: 'The value to deposit was invalid' })
  @ApiNotFoundResponse({ description: 'The wallet was not found' })
  deposit(
    @Param('id') id: string,
    @Body(ValidationPipe) data: CreateWalletDto,
  ) {
    return this.walletsService.deposit(id, data.value);
  }

  @Patch('withdraw/:id')
  @ApiOkResponse({
    description: 'The withdraw was succefully done',
    type: Wallet,
  })
  @ApiBadRequestResponse({ description: 'The value to withdraw was invalid' })
  @ApiNotFoundResponse({ description: 'The wallet was not found' })
  withdraw(
    @Param('id') id: string,
    @Body(ValidationPipe) data: CreateWalletDto,
  ) {
    return this.walletsService.withdraw(id, data.value);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The update was succefully done',
    type: Wallet,
  })
  @ApiBadRequestResponse({ description: 'The wallet was not found' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletsService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Deletion succefully done', type: Wallet })
  @ApiNotFoundResponse({ description: 'The wallet was not found' })
  remove(@Param('id') id: string) {
    return this.walletsService.remove(id);
  }
}
