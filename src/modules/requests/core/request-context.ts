import { DataSource } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';

import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { RequestEntity } from '@entities/request.entity';

import { RequestStrategy } from './request-strategy.interface';

/**
 * The Context defines the interface of interest to clients.
 */
@Injectable()
export class RequestContext {
  private _strategy: RequestStrategy;

  /**
   * @type {Strategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private get strategy(): RequestStrategy {
    if (!this._strategy) {
      throw new BadRequestException('Strategy is not set.');
    }

    return this._strategy;
  }

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: RequestStrategy) {
    this._strategy = strategy;
  }

  /**
   * The Context delegates some work to the Strategy object instead of
   * implementing multiple versions of the algorithm on its own.
   */
  public async createRequest(
    userId: string,
    createRequestDto: CreateRequestDto,
    waybillScan?: Express.Multer.File,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    console.log(
      `Context: Delegating request creation to the strategy: ${this.strategy.constructor.name}}`,
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.createRequest(
        queryRunner,
        userId,
        createRequestDto,
        waybillScan,
      );
      await queryRunner.commitTransaction();
      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  public async approveRequest(
    userId: string,
    requestNumber: string,
    approveRequestDto: ApproveReturnRequestDto,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    console.log(
      `Context: Delegating request creation to the strategy: ${this.strategy.constructor.name}}`,
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.approveRequest(
        queryRunner,
        userId,
        requestNumber,
        approveRequestDto,
      );
      await queryRunner.commitTransaction();
      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  public async updateRequestByCustomer(
    userId: string,
    requestNumber: string,
    updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    waybill?: Express.Multer.File,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    console.log(
      `Context: Delegating request creation to the strategy: ${this.strategy.constructor.name}}`,
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.updateRequestByCustomer(
        queryRunner,
        userId,
        requestNumber,
        updateRequestByCustomerDto,
        waybill,
      );
      await queryRunner.commitTransaction();
      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
