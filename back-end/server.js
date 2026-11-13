import express from 'express';

const app = express();

// temp from root
app.get('/', (req,res)=>{
    // sample
    res.send("Hello World");
})

app.listen(process.env.PORT ?? 3000) // listens on 3000 or env PORT (used in deployment(later))