import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';

import uploadConfig from '../config/upload';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const _createTransactionService = new CreateTransactionService();
const _deleteTransactionService = new DeleteTransactionService();

transactionsRouter.get('/', async (request, response) => {
  const _transcationRepository = getCustomRepository(TransactionsRepository);

  return response.json({
    transactions: await _transcationRepository.find(),
    balance: await _transcationRepository.getBalance(),
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const transaction = await _createTransactionService.execute({
    title,
    value,
    type,
    categoryName: category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await _deleteTransactionService.execute(id);
  return response.json({ message: 'ok' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
