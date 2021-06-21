import { Router } from 'express';

import settingsController from './controller/SettingsController';
import usersController from './controller/UsersController';
import messagesController from './controller/MessagesController';

const router = Router();

router.post('/settings', settingsController.create);

router.route('/settings/:username')
   .get(settingsController.findByUsername)
   .put(settingsController.update);

router.post('/users', usersController.create);

router.post('/messages', messagesController.create);

router.get('/messages/:user_id', messagesController.findByUser);

export default router;