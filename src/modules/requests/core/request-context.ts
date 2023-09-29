import { DataSource } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';

import { RequestEntity } from '@entities/request.entity';

import { ApproveRequestContextDto } from '../interfaces/approve-request-strategy.dto';
import { CreateRequestContextDto } from '../interfaces/create-request-strategy.dto';
import { RejectRequestContextDto } from '../interfaces/reject-request-strategy.dto';
import { UpdateRequestByCustomerContextDto } from '../interfaces/update-request-by-customer.strategy.dto';
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
    data: CreateRequestContextDto,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.createRequest({
        ...data,
        queryRunner,
      });
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
    data: ApproveRequestContextDto,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.approveRequest({
        ...data,
        queryRunner,
      });
      await queryRunner.commitTransaction();
      return request;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  public async rejectRequest(
    data: RejectRequestContextDto,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.rejectRequest({
        ...data,
        queryRunner,
      });
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
    data: UpdateRequestByCustomerContextDto,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const request = await this.strategy.updateRequestByCustomer({
        ...data,
        queryRunner,
      });
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
