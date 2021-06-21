import { Request, Response, NextFunction } from 'express';
import {UsersService} from '../services/UsersService';

class UsersController{
   async create(req: Request, res: Response, next: NextFunction): Promise<Response>{
      try{
         const { email } = req.body;
         const usersService = new UsersService();

         const user = await usersService.create(email);

         return res.status(201).json({
            user
         });
      }catch(err: unknown){
         console.log(err);
         return res.send();
      }
   }
}

export default new UsersController();