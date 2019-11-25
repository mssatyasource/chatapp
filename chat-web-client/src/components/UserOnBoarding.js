import React from 'react'
import PropTypes from 'prop-types'
import Form from './ChatForm'
import { ChatQuestions } from '../data/ChatQuestions'
import { 
  connectToSocket,
  lastQuestion,
  validAnswer,
  notValidAnswer,
  nextQuestion,
  firstQuestion
} from '../redux/actions'
import { List, Image, Ref } from 'semantic-ui-react'


const SERVER_BASE_URL = "http://127.0.0.1:8000"


const urlToNewSessionKey = SERVER_BASE_URL + '/sessionkeyview/'

const getSessionPromise = fetch(urlToNewSessionKey);

const urlToChatQuestions = SERVER_BASE_URL + '/chatquestionsview/'

let gen = null
let sessionkey = null




export default class UserOnBoarding extends React.Component {

  addMessage = (message) => {
    const { store } = this.context
    
    if(gen.validate(message) && gen.isNext(message)){
      const id = gen.getCurrentQuestionId()
      const question = gen.getNextQuestion()
      
      store.dispatch(validAnswer(id, message,sessionkey))
        .then(() => this.focus())
      
      if(gen.isLast()){
        return store.dispatch(lastQuestion(question))
          .then(() => this.focus())
      }

      return store.dispatch(nextQuestion(question))
        .then(() => this.focus())
    } else {
      const { questions } = store.getState()
      const prevQuestion = questions[questions.length - 1]
    
      return store.dispatch(notValidAnswer(message, prevQuestion))
        .then(() => this.focus())
    }
  }


  initNewSession(){
    getSessionPromise.then()

  }

  
  componentDidMount(){
    getSessionPromise.then(response=>response.json()).then(data=>{ console.log('data from session' + data); 
    sessionkey = data
    })

    console.log("init new sesio function start" + getSessionPromise)
    //alert(urlToChatQuestions);
    fetch(urlToChatQuestions)
      .then(res => res.json(),
      console.log('json response= ' )
      )
      .then(questions => gen = new ChatQuestions(questions))
      .then(() => {
        const { store } = this.context
        const question = gen.getNextQuestion()
        
        store.dispatch(firstQuestion(question))
      })
  }

  connect = () => {
    const { store } = this.context
    const socket = new WebSocket('wss://echo.websocket.org')
    socket.onopen = (message) => {
      console.log(message)
      store.dispatch(connectToSocket())
        .then(() => this.focus())
    }
  }

  focus = () => {
    // console.log(this.refs)
    // const len = Object.keys(this.refs).length
    // this.refs[len - 1].scrollIntoView()
  }

  buildMessages = (questions, answers) => {
    const messages = []
    let i = 0, j = 0
    while(i < questions.length && j < answers.length){
      messages.push(questions[i], answers[j])
      i++;
      j++
    }
    while(i < questions.length){
      messages.push(questions[i])
      i++;
    }
    while(j < answers.length){
      messages.push(answers[j])
      j++
    }
    return messages
  }
  
  render(){
    const { store } = this.context
    const { questions, answers, isTyping, isPatient, isConnected, name } = store.getState()
    const messages = this.buildMessages(questions, answers)
    const firstName = name.split(' ')[0]
    
    return (
      <React.Fragment>
        <List>
          {messages.map((message, index) => {
            return (
              <List.Item key={index}>
                <List.Icon name='marker' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>{firstName}</List.Header>
                  <List.Description color="grey">{message}</List.Description>
                </List.Content>
              </List.Item>
            )
          })}
        </List>
        <p>{isTyping ? 'typing...' : ''}</p>
        {isPatient && !isConnected && <button onClick={this.connect}>Connect To Doctor</button>}
       <Form onMessage={this.addMessage}/> 
      </React.Fragment>
    )
  }
}

UserOnBoarding.contextTypes = {
  store: PropTypes.object
}