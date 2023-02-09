require('dotenv').config()
const app = require('./app')

// Start the server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Application is running on port ${port}`)
})
