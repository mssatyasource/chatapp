
import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers'
import { reduxBatch }  from '@manaflair/redux-batch';
import ReduxThunk from 'redux-thunk'


const initialState = {
  "questions":[],
  "answers": [],
  "isTyping": false,
  "isPatient": false,
  "isConnected": false,
  "showOnBoardingMessage" : false
}

let store = createStore(reducer, compose(reduxBatch, applyMiddleware(ReduxThunk), reduxBatch, applyMiddleware(ReduxThunk), reduxBatch))

export default store