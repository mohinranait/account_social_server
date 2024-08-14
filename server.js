// const app = require("./app")
const expressServer = require("./app")
const { serverPort } = require("./src/config/secretEnv")

expressServer.listen(serverPort, () => {
    console.log(`Server is running at port http://localhost:${serverPort}`)
})