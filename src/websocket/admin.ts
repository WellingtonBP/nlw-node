import { Socket } from 'socket.io';
import { io } from '../app';

import { ConnectionsService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';

io.on('connect', async (socket: Socket) => {
   const connectionService = new ConnectionsService();
   const messagesService = new MessagesService();

   const allConnectionsWithoutAdmin = await connectionService.findAllWithoutAdmin();

   io.emit('admin_list_all_users', allConnectionsWithoutAdmin);

   socket.on('admin_list_messages_by_user', async (params, callback) => {
      const { user_id } = params;

      const allMessages = await messagesService.findByUser(user_id);
      
      callback(allMessages);
   });

   socket.on('admin_send_message', async (params) => {
      const { text, user_id } = params;
      const { socket_id } = await connectionService.findByUser(user_id);
      await messagesService.create({text, user_id, admin_id: socket.id});
      io.to(socket_id).emit('admin_send_to_client', {text, socket_id: socket.id});
   });

   socket.on('admin_user_in_support', async (params) => {
      const { user_id } = params;
      const connection = await connectionService.findByUser(user_id);
      
      connection.admin_id = socket.id;
      await connectionService.create(connection);
      const allConnectionsWithoutAdmin = await connectionService.findAllWithoutAdmin();
      io.emit('admin_list_all_users', allConnectionsWithoutAdmin);

   });

   socket.on('disconnect', async () => {
      const connections = await connectionService.findAllByAdminID(socket.id);

      for(let connection of connections){
         connection.admin_id = null;
         await connectionService.create(connection);
      }
      
      const allConnectionsWithoutAdmin = await connectionService.findAllWithoutAdmin();
      io.emit('admin_list_all_users', allConnectionsWithoutAdmin);
   });
});