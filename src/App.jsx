import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TicTacToe from './components/TicTacToe'
import { Provider } from 'react-redux'
import { store } from '../store'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <TicTacToe />
    </Provider>
  )
}

export default App
