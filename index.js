import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import { scheduleJob } from 'node-schedule';

import { updateSubscriptions } from './controllers/scheduling.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log(`DB Connected`))
  .catch((err) => console.error(`DB Connection Error ${err}`));

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const routeFiles = readdirSync('./routes');
for (const file of routeFiles) {
  const routeModule = await import(`./routes/${file}`);
  app.use('/api', routeModule.default);
}

const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);

const dailyTasks = scheduleJob('*/1 * * * *', () => {
  updateSubscriptions();
});
