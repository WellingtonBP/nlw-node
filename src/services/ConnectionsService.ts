import { getCustomRepository, Repository } from 'typeorm';

import { ConnectionsRepository } from '../repositories/ConnectionsRepository';
import { Connection } from '../entities/Connection';

interface IConnectionCreate{
   socket_id: string;
   user_id: string;
   admin_id?: string;
   id?: string;
}

export class ConnectionsService {
   private connectionsRepository: Repository<Connection>;

   constructor(){
      this.connectionsRepository = getCustomRepository(ConnectionsRepository);
   }

   async create({ socket_id, user_id, admin_id, id }: IConnectionCreate): Promise<Connection>{
      const connection = this.connectionsRepository.create({socket_id, user_id, admin_id, id});
      
      await this.connectionsRepository.save(connection);

      return connection;
   }

   async findByUser(user_id: string): Promise<Connection>{
      const connection = this.connectionsRepository.findOne({user_id});

      return connection;
   }

   async findAllWithoutAdmin(): Promise<Connection[]>{
      const connections = await this.connectionsRepository.find({where: {admin_id: null}, relations: ['user']});
      return connections;
   }

   async findBySocketID(socket_id: string): Promise<Connection>{
      const connection = this.connectionsRepository.findOne({socket_id});

      return connection;
   }

   async findAllByAdminID(admin_id): Promise<Connection[]>{
      const connections = this.connectionsRepository.find({admin_id});

      return connections;
   }
}