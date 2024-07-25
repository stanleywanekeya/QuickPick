const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();


//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

//environment variable
env.config();

//mongodb connection
const dev_db_url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.qjluvek.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB).then(() => {
        console.log('Database connected')
    });
}

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is runnning on port ${process.env.PORT}`);
});
