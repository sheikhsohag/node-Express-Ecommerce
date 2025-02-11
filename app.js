import express from 'express';
import router from './src/app/route/index.js';
const app = express();
app.use(express.json());

app.use('/api', router);
app.use('/', (req, res) => {
    res.send('Server is running!');
});

export default app;
