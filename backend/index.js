const express = require('express');
const cors = require('cors')
const connectToMongo = require('./db');

connectToMongo();

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json())
// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})