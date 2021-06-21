import express, { response } from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import './database';

import router from './routes';

const app = express();
const http = createServer(app);
const io = new Server(http);

app.use(express.static(path.join(__dirname, '..', 'public')))
app.set('views', path.join(__dirname, '..', 'public', 'html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.json());

app.get('/view/client', (req, res) => {
   res.render('client.html');
});

app.get('/view/admin', (req, res) => {
   res.render('admin.html');
});

app.use(router);

export { http, io }