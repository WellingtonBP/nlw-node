import { getCustomRepository, Repository } from 'typeorm';
import { Setting } from '../entities/Setting';
import { SettingsRepository } from '../repositories/SettingsRepository';

interface ISettingsService{
   chat: boolean;
   username: string;
}

export class SettingsService{
   private settingsRepository: Repository<Setting>;

   constructor(){
      this.settingsRepository = getCustomRepository(SettingsRepository);
   }

   async create({chat, username}: ISettingsService): Promise<Setting> {
      const existingSetting = await this.settingsRepository.findOne({username});
      if(existingSetting){
         throw new Error('User alread exists!');
      }
      const setting = this.settingsRepository.create({chat, username});
      await this.settingsRepository.save(setting);
      return setting;
   }

   async findByUsername(username: string): Promise<Setting> {
      const setting = await this.settingsRepository.findOne({username});
      return setting;
   }

   async update({chat, username}: ISettingsService): Promise<void> {
      await this.settingsRepository.createQueryBuilder()
         .update(Setting)
         .set({chat})
         .where('username = :username', {username})
         .execute(); 
   }
}
