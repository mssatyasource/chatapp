const ADD_QUESTION = 'ADD_QUESTION'
const ADD_RIGHT_ANSWER = 'ADD_RIGHT_ANSWER'
const STOP_TYPING = 'STOP_TYPING'
const START_TYPING = 'START_TYPING'
const CHANGE_PATIENT_STATUS = 'CHANGE_PATIENT_STATUS'
const CONNECTED = 'CONNECTED'
const SET_NAME = 'SET_NAME'

const SERVER_BASE_URL = "http://127.0.0.1:8000/";

//const urlToPUT = (id) => `https://jsonplaceholder.typicode.com/posts/${id}`
const urlPostAnswer = SERVER_BASE_URL + "onboardingview/";

//actions
export const addQuestion = (question) => {
  return {
    type: ADD_QUESTION,
    payload: question
  }
}

export const addRightAnswer = (answer) => {
  return {
    type: ADD_RIGHT_ANSWER,
    payload: answer
  }
}

export const stopTyping = () => {
  return {
    type: STOP_TYPING,
    payload: false
  }
}

export const changePatientStatus = () => {
  return {
    type: CHANGE_PATIENT_STATUS,
    payload: true
  }
}

export const setName = (name) => {
  return {
    type: SET_NAME,
    payload: name
  }
}


//async actions
export const nextQuestion = (question) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch([stopTyping(), addQuestion(question)])
        resolve()
      }, 2000)
    })
  }
}

export const firstQuestion = (question) => {
  return (dispatch) => {
    dispatch(startTyping())
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch([stopTyping(), addQuestion(question)])
        resolve()
      }, 1000)
    })
  }
}


export const postAndAddAnswer = (id, answer,key) => {
  console.log(">>>this is from code >>>" + id + ":" + answer);
  return (dispatch) => {
    dispatch(addRightAnswer(answer))
    
    var data = new Object();
        data.Skey = key;
        data.QuestionID = id;
        data.Answer = answer;
        //data = JSON.stringify(data);
        console.log(data)
       
    return fetch(
      urlPostAnswer, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json;'}),
        
        body: JSON.stringify(data)
      }
    )
    .then(resp => resp.json())
    .then(console.log)
    .catch(console.error)
  }
}

export const lastQuestion = (question) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch([stopTyping(), addQuestion(question), changePatientStatus()])
        resolve()
      }, 2000)
    })
  }
}

export const validAnswer = (id, message,key) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch([postAndAddAnswer(id, message,key), startTyping()])
      resolve()
    })
  }
}

export const notValidAnswer = (answer, question) => {
  return (dispatch) => {
    dispatch([addRightAnswer(answer), startTyping()])
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch([stopTyping(), addQuestion(question)])
        resolve()
      }, 2000)
    })
  }
}

export const startTyping = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch({
          type: START_TYPING,
          payload: true
        })
        resolve()
      }, 300)
    })
  }
}

export const connectToSocket = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch([{type: CONNECTED, payload: true}, addQuestion('Doctor is now connected'), setName('Doctor Who')])
      resolve()
    })
  }
} 