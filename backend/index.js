const express = require('express');
const path = require('path');
const routineRoutes = require('./Routes /routineRoute');
const authRoutes = require('./Routes /authRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100kb' }));



app.use('/api/auth/', authRoutes);
app.use('/api/', routineRoutes);
app.use(express.static(path.join(__dirname, 'frontend')));


app.listen(8000, ()=>{
    console.log('server live on port 8000');
})