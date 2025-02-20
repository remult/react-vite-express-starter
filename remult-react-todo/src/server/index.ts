// src/server/index.ts
import express from 'express'
import { api } from "./api.js"

const app = express()
app.use(api)

app.listen(3002, () => console.log('Server started'))