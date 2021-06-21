import { Socket } from 'socket.io';

import { io } from '../app';
import { ConnectionsService } from '../services/ConnectionsService';
import { UsersService } from '../services/UsersService';
import { MessagesService } from '../services/MessagesService';

io.on('connect', (socket: Socket) => {
   const connectionsService = new ConnectionsService();
   const usersService = new UsersService();
   const messagesService = new MessagesService();

   socket.on('client_first_access', async (params) => {
      const socket_id = socket.id;
      const { text, email } = params;

      const user = await usersService.findByEmail(email) || await usersService.create(email);

      const connection = await connectionsService.findByUser(user.id);

      if(!connection){
         await connectionsService.create({
            socket_id,
            user_id: user.id
         });
      }else{
         connection.socket_id = socket_id;
         await connectionsService.create(connection);
      }

      await messagesService.create({user_id: user.id, text});
      const messages = await messagesService.findByUser(user.id);

      socket.emit('client_list_all_messages', messages);

      const allUsers = await connectionsService.findAllWithoutAdmin();
      io.emit('admin_list_all_users', allUsers);
   });
   
   socket.on('client_send_to_admin', async (params) => {
      const {text, socket_admin_id} = params;

      const { user_id } = await connectionsService.findBySocketID(socket.id);
      await messagesService.create({text, user_id});

      io.to(socket_admin_id).emit('admin_receive_message', {text, socket_id: socket.id});
   });
})