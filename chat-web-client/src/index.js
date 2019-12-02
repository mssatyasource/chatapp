import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import App from './App'
import url from './styles.css';
import store from './redux/store'

class Provider extends React.Component {
  getChildContext(){
    return {
      store: this.props.store
    }
  }

  render(){
    return this.props.children
  }
}

Provider.childContextTypes = {
  store: PropTypes.object
}

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, 
    document.getElementById('root')
  )
}

store.subscribe(render)

render()
