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
import { isDecorator, thisTypeAnnotation } from '@babel/types'


const SERVER_BASE_URL = "http://127.0.0.1:8000"


const urlToNewSessionKey = SERVER_BASE_URL + '/sessionkeyview/'
const urlToGetOnboadringInformation = SERVER_BASE_URL + '/onboardingview/'

const getSessionPromise = fetch(urlToNewSessionKey);
const getOnBoardingQuestionsPromise = fetch(urlToGetOnboadringInformation)

const urlToChatQuestions = SERVER_BASE_URL + '/chatquestionsview/'

let gen = null
let sessionkey = null
let onBoardingList = null





export default class UserOnBoarding extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showUserOnBoardings: false,
    };
   
  }

  addMessage = (message) => {
    const { store } = this.context

    message = message.toLowerCase();
    console.log('main message lower=' + message);
    
    if(gen.validate(message) && gen.isNext(message)){
      const id = gen.getCurrentQuestionId()
      const question = gen.getNextQuestion()
      
      store.dispatch(validAnswer(id-1, message,sessionkey))
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

  

  buildOnboardingMessage = ()=> {


    

    getOnBoardingQuestionsPromise.then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
     for(var i = 0;i<data.length-1;i++){
       var obj = data[i]
       obj.Question = gen.getQuestion(obj.QuestionID)
       console.log('var quesstr=' + obj.Question)
     }
     onBoardingList = data
     this.setState({
      showUserOnBoardings : true

    })
     
    })
   
    

    
  }

  getOnBoardingData(){
    getOnBoardingQuestionsPromise.then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
     for(var i = 0;i<data.length-1;i++){
       var obj = data[i]
       obj.Question = gen.getQuestion(obj.QuestionID)
       console.log('QID='+ obj.QuestionID + "Question=" + obj.Question)
     }
     return data
    })

  }


   renderOnBoarding = () => {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < onBoardingList.length; i++) {
      var data = onBoardingList[i]
      let children = []
      children.push(<td>{data.Question }</td>)
      children.push(<td>{data.Answer }</td>)
      console.log('Q = ' + data.Question + 'A=' + data.Answer)
      table.push(<tr key={data.Id}>{children}</tr>)
    }
    return table
    
   
  }

  


  
  componentDidMount(){

    // 1. Get unique session key from server
    getSessionPromise.then(response=>response.json()).then(data=>{ console.log('data from session' + data); 
    sessionkey = data
    })

    console.log("init new sesio function start" + sessionkey)
    // 2. Fetch the Questions from server
    fetch(urlToChatQuestions)
      .then(res => res.json() )
      .then(questions => gen = new ChatQuestions(questions))
      .then(() => {
        const { store } = this.context
        const question = gen.getNextQuestion()
        
        store.dispatch(firstQuestion(question))
      })
      
  }
  showOnBoarding = () =>{

    const { store } = this.context
    this.buildOnboardingMessage()
    
    
    
    

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
    const { questions, answers, isTyping, isPatient, isConnected, isShowOnboard,name} = store.getState()
    const messages = this.buildMessages(questions, answers)
    const firstName = name.split(' ')[0]
    

    
    return (
      <div>
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
        {isPatient && !isConnected && <button onClick={this.connect}>Connect To Doctor</button> }
        {<button onClick={this.showOnBoarding}>Show Messages To Doctor</button> }
       <Form onMessage={this.addMessage}/>

       <div>
         {this.state.showUserOnBoardings ?
        <div>
        <table > 
        <tr>
        <th>Question</th>
        <th>ANswer</th>
  </tr>
        {this.renderOnBoarding()}
        </table>
        </div>
         : null
         }
       </div>
      
      </React.Fragment>
      </div>
     
     
     
    )
  }
}

UserOnBoarding.contextTypes = {
  store: PropTypes.object
}