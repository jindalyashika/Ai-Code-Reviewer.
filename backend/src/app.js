const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');

const app = express();

// ✅ Allow your Vercel frontend and local dev
app.use(cors({
  origin: [
    'https://ai-code-reviewer-navy-sigma.vercel.app', 
    'http://localhost:5173' 
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/ai', aiRoutes);

module.exports = app;
