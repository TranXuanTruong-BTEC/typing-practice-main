import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      // Khi user join vào một conversation
      socket.on('join', (conversationId) => {
        socket.join(conversationId);
      });
      // Khi user gửi tin nhắn
      socket.on('chat-message', (data) => {
        // data: { conversationId, message }
        io.to(data.conversationId).emit('chat-message', data);
      });
    });
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 