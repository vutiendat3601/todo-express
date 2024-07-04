import initApp from './app/init-app';
import express, { Express } from 'express';

const app: Express = express();

const startApp = initApp(app);
startApp();
