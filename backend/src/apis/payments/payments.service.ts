import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly datasource: DataSource,
  ) {}

  async create({ impUid, paymentAmount, user: _user }): Promise<Payment> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const payment = this.paymentsRepository.create({
        impUid: impUid,
        paymentAmount: paymentAmount,
        user: _user.id,
        status: PAYMENT_STATUS_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(payment);
      //
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedUser = this.usersRepository.create({
        ...user,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createCancel({ impUid, paymentAmount, user: _user }) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const payment = this.paymentsRepository.create({
        impUid,
        paymentAmount: -paymentAmount,
        user: _user,
        status: PAYMENT_STATUS_ENUM.CANCEL,
      });

      await queryRunner.manager.save(payment);

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedUser = this.usersRepository.create({
        ...user,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findStatus({ impUid }): Promise<Payment> {
    return await this.paymentsRepository.findOne({
      where: { impUid },
    });
  }
}
