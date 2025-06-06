import { Router } from 'express';
import { AccountingEntryController } from '../controllers/AccountingEntryController';

const router = Router();
const controller = new AccountingEntryController();

router.post('/entries', controller.create.bind(controller));
router.get('/entries', controller.list.bind(controller));
router.get('/entries/monthly', controller.getMonthlyEntries.bind(controller));
router.get('/entries/yearly', controller.getYearlyEntries.bind(controller));

export default router; 