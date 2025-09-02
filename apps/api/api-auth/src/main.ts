import express from 'express';
import * as path from 'path';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to api-auth!' });
});

app.use('/auth', authRoutes);

const port = process.env.API_AUTH_PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
