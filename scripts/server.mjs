import express from 'express'
import build from './build.mjs'

build()

function createDevelopmentServer() {
    const app = express()

    app.use(express.static('dist'))

    return app.listen(3000, () => {
        console.log('Server running on http://localhost:3000')
    })
}

createDevelopmentServer()
