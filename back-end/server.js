import express from 'express';
import profileRoutes from './profileRoutes.js';

const app = express();

// temp from root
app.get('/', (req, res) => {
    // sample
    res.send("Hello World");
})

app.use(express.json()) //express reading json
app.use('/api/profile', profileRoutes) //mounting the profile

app.listen(process.env.PORT ?? 3000) // listens on 3000 or env PORT (used in deployment(later))