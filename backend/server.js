require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
dbConnect();

app.use(cors());
app.use(express.json());

app.use('/api',authRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, (error) => {
    if(!error){
        console.log(`Server is running on port ${PORT}`);
    }
})