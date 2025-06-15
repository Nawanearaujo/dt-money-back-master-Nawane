import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode, 
  HttpStatus, 
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Response } from 'express'; 

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() res: Response,
  ) {
    try {
      const createdTransaction =
        await this.transactionService.create(createTransactionDto);
      res.status(HttpStatus.CREATED).send(createdTransaction); 
    } catch (error) {
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Erro ao criar transação',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const transactions = await this.transactionService.findAll();
      res.status(HttpStatus.OK).send(transactions); 
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Erro ao buscar transações',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const transaction = await this.transactionService.findOne(id);
      res.status(HttpStatus.OK).send(transaction); 
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send({ message: error.message }); 
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: 'Erro ao buscar transação',
          error: error.message,
        });
      }
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Res() res: Response,
  ) {
    try {
      const updatedTransaction = await this.transactionService.update(
        id,
        updateTransactionDto,
      );
      res.status(HttpStatus.OK).send(updatedTransaction); 
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send({ message: error.message }); 
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: 'Erro ao atualizar transação',
          error: error.message,
        });
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.transactionService.remove(id);
      res.status(HttpStatus.NO_CONTENT).send(); 
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send({ message: error.message }); 
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: 'Erro ao remover transação',
          error: error.message,
        });
      }
    }
  }
}