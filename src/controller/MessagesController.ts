import { Request, Response, NextFunction } from 'express';
import {MessagesService} from '../services/MessagesService';


class MessagesController{
   async create(req: Request, res: Response, next: NextFunction): Promise<Response>{
      try{
         const { admin_id, text, user_id } = req.body;
         const messagesService = new MessagesService();

         const message = await messagesService.create({admin_id, text, user_id});

         return res.status(201).json(message);
      }catch(err){
         console.log(err);
         return res.send();
      }
   }

   async findByUser(req: Request, res: Response, next: NextFunction): Promise<Response>{
      try{
         const { user_id } = req.params;
         const messagesService = new MessagesService();
         const messages = await messagesService.findByUser(user_id);
         return res.status(200).json(messages);
      }catch(err){
         console.log(err);
         return res.send();
      }
   }
}

export default new MessagesController();