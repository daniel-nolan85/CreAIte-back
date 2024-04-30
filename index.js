import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import { scheduleJob } from 'node-schedule';
import { Server } from 'socket.io';
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

const dailyTasks = scheduleJob('0 0 * * *', () => {
  updateSubscriptions();
});

const io = new Server(server, {
  path: '/socket.io',
  pingTimeout: 60000,
  cors: {
    origins: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-type'],
  },
  maxHttpBufferSize: 1e8,
  secure: true,
});

let users = [];

const addUser = (userId, socketId) => {
  const existingUserIndex = users.findIndex((user) => user.userId === userId);

  if (existingUserIndex !== -1) {
    users.splice(existingUserIndex, 1);
  }
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('connected to socket.io');
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });
  socket.on('sendMessage', ({ sender, receiverId, message }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        sender,
        message,
        receiverId,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected from socket.io');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
