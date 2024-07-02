const app = require("./app")
const { serverPort } = require("./src/config/secretEnv")

app.listen(serverPort, () => {
    console.log(`Server is running at port http://localhost:${serverPort}`)
})