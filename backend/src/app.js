const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express();

// ✅ FIXED: Add your Vercel URL to CORS
app.use(cors({
  origin: [
    'https://ai-code-reviewer-lgmy.onrender.com', // Your Vercel URL
    'http://localhost:5173'                          // Local development
  ],
  credentials: true
}))

app.use(express.json())
app.get('/', (req, res) => { res.send('Hello World') })
app.use('/ai', aiRoutes)

module.exports = app
