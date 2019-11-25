import React from 'react'
import { Button, Input, Icon } from 'semantic-ui-react'

const ChatForm = (props, context) => {
  const [value, setValue] = React.useState('')

  const onClick = (e) => {
    e.preventDefault()

    props.onMessage(value)
    setValue('')
  }
  
  return(
    <div>
      <Input size="huge" placeholder="Type here" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button size='huge' color='blue' onClick={onClick}><Icon name='send' /></Button>
    </div>
  )
}


export default ChatForm