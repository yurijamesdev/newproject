const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.post('/', (req, res) => {
    console.log('Received Form Data:', req.body);
})
// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`💬 Server is running on port ${PORT}`);
});