import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();

app.listen({
    port: process.env.PORT,
    hostname: process.env.HOSTNAME
}, ()=> console.log(`Running on ${process.env.HOSTNAME}:${process.env.PORT}`));