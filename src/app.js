const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")
const createError = require("http-errors")
const { connectDB } = require("./configs/database")
const router = require("./routes")
const config = require("./configs/index")
const swaggerDocs = require("./configs/swagger")

dotenv.config()

const app = express()
const PORT = config.port || 3000

const whitelist = ["http://localhost:5173"]

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (whitelist.includes(origin) || /\.ngrok\-free\.app$/.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error("Not allowed by CORS"))
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
  ],
  exposedHeaders: ["Content-Type", "Content-Length"],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

async function startServer() {
  try {
    await connectDB()

    app.use("/api", router)
    swaggerDocs(app)

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("❌ Failed to start server:", err)
    process.exit(1)
  }
}

startServer()
