import React from 'react'
import PropTypes from 'prop-types'
import OnBoarding from './components/UserOnBoarding'
import { Header, Icon } from 'semantic-ui-react'


const App = (props, context) => { 
  const { name } = context.store.getState()
  return (
    <div className="chat">
      <Header as='h2'>
        <Icon name='user' />
        <Header.Content>{name}</Header.Content>
      </Header>
      <OnBoarding />
    </div>
  )
}

App.contextTypes = {
  store: PropTypes.object
}

export default App
