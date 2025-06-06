import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { AccountingEntry } from '../entities/AccountingEntry';
import { Between } from 'typeorm';

export class AccountingEntryController {
  private repository = AppDataSource.getRepository(AccountingEntry);

  async create(req: Request, res: Response) {
    try {
      const entryData = req.body;
      if (entryData.date) {
        const date = new Date(entryData.date);
        date.setDate(date.getDate() + 1);
        entryData.date = date;
      }
      const entry = this.repository.create(entryData);
      const result = await this.repository.save(entry);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(_req: Request, res: Response) {
    try {
      const entries = await this.repository.find({
        order: {
          date: 'DESC'
        }
      });
      return res.json(entries);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getMonthlyEntries(req: Request, res: Response) {
    try {
      const { year, month } = req.query;
      
      if (!year || !month) {
        return res.status(400).json({ error: 'Year and month are required' });
      }

      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

      console.log('Querying entries between:', startDate, 'and', endDate);

      const entries = await this.repository.find({
        where: {
          date: Between(startDate, endDate)
        },
        order: {
          date: 'ASC'
        }
      });

      const totals = entries.reduce((acc, entry) => {
        if (entry.type === 'CREDIT') {
          acc.credits += Number(entry.value);
        } else {
          acc.debits += Number(entry.value);
        }
        return acc;
      }, { credits: 0, debits: 0 });

      return res.json({
        entries,
        totals,
        month: Number(month)
      });
    } catch (error) {
      console.error('Error in getMonthlyEntries:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getYearlyEntries(req: Request, res: Response) {
    try {
      const { year } = req.query;
      
      if (!year) {
        return res.status(400).json({ error: 'Year is required' });
      }

      const startDate = new Date(Number(year), 0, 1); // January 1st
      const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999); // December 31st

      console.log('Querying entries between:', startDate, 'and', endDate);

      const entries = await this.repository.find({
        where: {
          date: Between(startDate, endDate)
        },
        order: {
          date: 'ASC'
        }
      });

      // Group entries by month
      const monthlyEntries = entries.reduce((acc, entry) => {
        const month = new Date(entry.date).getMonth();
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(entry);
        return acc;
      }, {} as Record<number, typeof entries>);

      // Calculate totals for each month and overall
      const monthlyTotals = Object.entries(monthlyEntries).map(([month, monthEntries]) => {
        const totals = monthEntries.reduce((acc, entry) => {
          if (entry.type === 'CREDIT') {
            acc.credits += Number(entry.value);
          } else {
            acc.debits += Number(entry.value);
          }
          return acc;
        }, { credits: 0, debits: 0 });

        return {
          month: Number(month),
          entries: monthEntries,
          totals
        };
      });

      // Calculate overall totals
      const overallTotals = entries.reduce((acc, entry) => {
        if (entry.type === 'CREDIT') {
          acc.credits += Number(entry.value);
        } else {
          acc.debits += Number(entry.value);
        }
        return acc;
      }, { credits: 0, debits: 0 });

      return res.json({
        monthlyEntries: monthlyTotals,
        overallTotals
      });
    } catch (error) {
      console.error('Error in getYearlyEntries:', error);
      return res.status(500).json({ error: error.message });
    }
  }
} 