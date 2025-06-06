import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import accountingEntryRoutes from './routes/accountingEntry.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', accountingEntryRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  }); 