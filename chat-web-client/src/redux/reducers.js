import { combineReducers } from 'redux'

function questionsReducer(state=[], action){
  switch(action.type){
    case 'ADD_QUESTION':
      return [
        ...state,
        action.payload
      ]
    default:
      return state
  }
}

function answersReducer(state=[], action){
  switch(action.type){
    case 'ADD_RIGHT_ANSWER':
      return [
        ...state,
        action.payload
      ]
    default:
      return state
  }
}

function typingReducer(state=false, action){
  switch(action.type){
    case 'START_TYPING':
      return true
    case 'STOP_TYPING':
      return false
    default:
      return state
  }
}

function patientReducer(state=false, action){
  switch(action.type){
    case 'CHANGE_PATIENT_STATUS':
      return true
    default:
      return state
  }
}

function connectionReducer(state=false, action){
  switch(action.type){
    case 'CONNECTED':
      return true
    case 'DICONNECTED':
      return false
    default:
      return state
  }
}


  function nameReducer(state="Cerebral vRep", action){
  
  switch(action.type){
    case 'SET_NAME':
      return action.payload
    default:
      return state
  }
}

function showOnboardReducers(state=false,action){
  switch(action.type){
    case 'SHOW':
      return true;
    case 'HIDE':
      return false;
    default:
      return false
  }
}

export default combineReducers({
  questions: questionsReducer,
  answers: answersReducer,
  isTyping: typingReducer,
  isPatient: patientReducer,
  isConnected: connectionReducer,
  name: nameReducer,
  showOnBoardingMessage :showOnboardReducers,
})