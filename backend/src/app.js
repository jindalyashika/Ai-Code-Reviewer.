const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express();

// ✅ FIXED: Add specific CORS origins for production
app.use(cors({
  origin: [
    'https://ai-code-reviewer-lgmy.onrender.com', // Your Vercel frontend
    'http://localhost:5173'                 // Local development
  ],
  credentials: true
}))

app.use(express.json())
app.get('/', (req, res) => { res.send('Hello World') })
app.use('/ai', aiRoutes)

module.exports = app
