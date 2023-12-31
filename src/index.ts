import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index'


const app = express();

app.use(cors({
    credentials : true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/')
})

const MONGO_URL = "";

mongoose.Promise = Promise;
try{
    mongoose.connect(MONGO_URL, {dbName : 'USERS'});
    console.log('>>>>>DB connected')
}catch(err){
    mongoose.connection.on('error', (err : Error) => {
        console.log(err)
    })

}

app.use('/', router())