import { useState } from 'react'
import Project from './pages/Project'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Project></Project>
    </>
  )
}

export default App
