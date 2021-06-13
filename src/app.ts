import express from 'express';
import redis from 'redis';
import ussdMenuBuilder from './menu-builder'

const app: express.Application = express();
app.disable('etag').disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CONNECT TO REDIS SERVER
const redisClient = redis.createClient({
    host: "localhost",
    // password: "pass123",
    port: 6379
})

redisClient.on('connect', () => {
    console.log('Connected to redis server');
})

redisClient.on('error', (err) => {
    console.log('Redis connection error', err);
})

// USSD ROUTE
app.post('/ussd', async (req, res) => {
    let menu_res;
    try{
      // RUN THE MENU BUILDER
      // PASS REQ BODY AND REDIS CLIENT
        menu_res = await ussdMenuBuilder(req.body, redisClient);
    } catch(e){
        console.log("MENU ERROR");
        return res.send(e)
        
    }
    res.send(menu_res);
});


const port = 4000;
app.listen(port, () => console.log(`Server listening at port ${port}`));