import { EntityRepository, getRepository, Repository } from 'typeorm';
import Category from '../models/Category';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();

    const balance: Balance = transactions.reduce(
      (acc: Balance, tran: Transaction) => {
        acc.income += (tran.type === 'income' ? tran.value : 0) * 1;
        acc.outcome += (tran.type === 'outcome' ? tran.value : 0) * 1;
        acc.total += tran.value * (tran.type === 'income' ? 1 : -1);
        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }

  public async getCategory(categoryName: string): Promise<Category> {
    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    if (!category) {
      const categoryCreated = categoryRepository.create({
        title: categoryName,
      });

      category = await categoryRepository.save(categoryCreated);
    }

    return category;
  }
}

export default TransactionsRepository;
