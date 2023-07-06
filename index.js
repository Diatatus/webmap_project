const express = require("express")
const fs = require("fs")

const app = express()

const port = 8081

app.get("/", (__, res) => {
    const indexHtml = fs.readFileSync(__dirname + "/HTML/index.html", "utf-8")
    
    res.send(indexHtml)
})

  



app.use("/CSS", express.static(__dirname + "/CSS/"))

app.use("/JS", express.static(__dirname + "/JS/"))

app.use("/RSC/IMG", express.static(__dirname + "/RSC/IMG/"))

app.use("/RSC/GeoJson", express.static(__dirname + "/RSC/GeoJson/"))


app.use("/node_modules/ol-ext/dist", express.static(__dirname + "/node_modules/ol-ext/dist/"))

app.use("/node_modules/ol/dist", express.static(__dirname + "/node_modules/ol/dist/"))

app.use("/node_modules/ol-layerswitcher/dist", express.static(__dirname + "/node_modules/ol-layerswitcher/dist/"))

app.use("/node_modules/ol-sidebar", express.static(__dirname + "/node_modules/ol-sidebar/"))

app.use("/node_modules/ol", express.static(__dirname + "/node_modules/ol/"))



app.use("/node_modules/reqwest/src", express.static(__dirname + "/node_modules/reqwest/src/"))

app.listen(port, () => {
  console.log(`Le serveur est lancé sur le port ${port}`)
})