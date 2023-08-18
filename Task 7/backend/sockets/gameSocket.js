const mathGameSocket = require('./mathGameSocket');
const TicTacToeSocket = require('./TicTacToeSocket')


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

      TicTacToeSocket(socket, io)

      mathGameSocket(socket, io);


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
