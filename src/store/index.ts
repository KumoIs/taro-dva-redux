import { createStore, applyMiddleware } from 'redux'


// 引入中间件
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

// 引入根reduces
import rootReduces from './rootReduces'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

export default function configStore() {
  return createStore(rootReduces, applyMiddleware(...middlewares))
}