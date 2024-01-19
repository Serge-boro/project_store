const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
const mongoose = require('mongoose')
const { ApolloServer, gql } = require('apollo-server-express')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const keys = require('./keys')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  // helpers: require('./utils/hbs-helper'),
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      collection: 'sessions',
      uri: keys.MongoDB_URI,
    }),
  })
)

app.use(flash())
const varMiddleware = require('./middleware/variables')
const UserMiddleware = require('./middleware/user')
app.use(varMiddleware)
app.use(UserMiddleware)

const homeRouter = require('./routers/home')
const productsRouter = require('./routers/products')
const aboutRouter = require('./routers/about')
const storeRouter = require('./routers/store')
const authRouter = require('./routers/auth')
const orderRouter = require('./routers/orders')
app.use('/', homeRouter)
app.use('/products', productsRouter)
app.use('/about', aboutRouter)
app.use('/store', storeRouter)
app.use('/auth', authRouter)
app.use('/orders', orderRouter)

const errorHandle = require('./middleware/404')
app.use(errorHandle)

const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolver')

async function start() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app: app, path: '/truly' })

  await mongoose
    .connect(keys.MongoDB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => console.log('Connected mongodb...'))
    .catch((err) => console.error('Could not connect ...', err))

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Lisening on port ${port}...`))
}

start()
