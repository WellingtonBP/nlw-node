import { NextFunction, Request, Response } from "express";
import { SettingsService } from '../services/SettingsService';

class SettingsController{
   async create(req: Request, res: Response, next: NextFunction): Promise<Response>{
      try{
         const { chat, username } = req.body;
         const settingsService = new SettingsService();

         const setting = await settingsService.create({chat, username}); 
         return res.status(201).json({
            message: 'setting created successfully',
            setting
         });
      }catch(err){
         console.log(err);
         return res.send();
      }
   }

   async findByUsername(req: Request, res: Response, next: NextFunction): Promise<Response>{
      try{
         const { username } = req.params;
         const settingsService = new SettingsService();

         const setting = await settingsService.findByUsername(username);
         return res.status(200).json(setting);
      }catch(err){
         console.log(err);
         return res.send();
      }
   }

   async update(req: Request, res: Response, next: NextFunction): Promise<Response>{
      try{
         const { username } = req.params;
         const { chat } = req.body;
         const settingsService = new SettingsService();

         await settingsService.update({username, chat});
         return res.status(204).json({
            message: 'setting updated successfully'
         });
      }catch(err){
         console.log(err);
         return res.send();
      }
   }
}

export default new SettingsController();