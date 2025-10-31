const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")
const createError = require("http-errors")
const { connectDB } = require("./configs/database")
const router = require("./routes")
const config = require("./configs/index")
const setupSwagger = require("./swagger")

dotenv.config()

const app = express()
const PORT = config.port || 3000

app.use(express.json())

async function startServer() {
  try {
    await connectDB()

    app.use("/api", router)
    setupSwagger(app)
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("❌ Failed to start server:", err)
    process.exit(1)
  }
}

startServer()
