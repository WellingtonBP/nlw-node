import { getCustomRepository, Repository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';
import { User } from "../entities/User";

export class UsersService{
   private usersRepository: Repository<User>;

   constructor(){
      this.usersRepository = getCustomRepository(UsersRepository);
   }

   async create(email:  string): Promise<User> {
      const existingUser = await this.usersRepository.findOne({email});
      if(existingUser) return existingUser;

      const user = this.usersRepository.create({email});
      await this.usersRepository.save(user);
      return user;
   }

   async findByEmail(email: string): Promise<User>{
      const user = await this.usersRepository.findOne({email});
      return user;
   }
}