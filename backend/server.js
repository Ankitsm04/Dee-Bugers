const express = require('express');
const app = express();
const connectDb = require('./utils/db');
const authRoutes = require('./routes/user-routes');
const cors = require('cors');
const serviceRoutes = require('./routes/service-routes');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies and authorization headers
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

connectDb().then(async () => {
    app.listen(8001, () => {
        console.log('Server is running on port 8001');
    })
}).catch((error) => {
    console.log(error);
});