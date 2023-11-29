const http = require('http');
const dotenv = require('dotenv');
const {Server} = require('socket.io');

const httpServer = http.createServer();
dotenv.config();

// const chatURL = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3002';

const io = new Server(httpServer, {
  cors: {
    // origin: chatURL,
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('joinChatRoom', (chatId) => {
    socket.join(chatId);
    console.log(`user with id-${socket.id} joined chat - ${chatId}`);
  });

  socket.on('sendMessage', (data) => {
    console.log(data);
    socket.to(data.chatId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.NEXT_PUBLIC_WS_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
