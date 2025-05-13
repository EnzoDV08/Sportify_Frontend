import { useState, useEffect } from 'react'
import { PropagateLoader } from 'react-spinners'
import viteLogo from '../assets/vite.svg'
import reactLogo from '../assets/react.svg'
import '../Style/App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={viteLogo} alt="Vite Logo" className="loading-logo" />
        <PropagateLoader color="#0078d7" size={15} />
        <p className="loading-text">Loading the future... 🚀</p>
      </div>
    )
  }

  // 👇 after loading finishes, show Vite + React logos
  return (
    <>
      <div>
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
