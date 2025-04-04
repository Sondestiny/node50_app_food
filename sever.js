import express from 'express'
import sequelize, { models } from './src/Common/Sequelizes/ConnectDB.js'
const app = express()
const port = 3000

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// tạo model từ database
//npx sequelize-auto -h localhost -d node_50_cybersoft -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json -l esm
app.get('/sequelize/getRoles', async (req, res, next)=> {
  const roles = await models.Roles.findAll({raw: true})
  console.log(roles)
  res.json(roles)
})
app.get('/sequelize/getUser', async (req, res, next)=> {
  const users = await models.Users.findAll({raw: true})
  console.log(users)
  res.json(users)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})