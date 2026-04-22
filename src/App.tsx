import { FileExplorer } from './components/FileExplorer'
import './App.css'

function App() {
  return (
    <>
      <section id="center" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ marginTop: '20px', width: '100%' }}>
          <FileExplorer />
        </div>
      </section>
    </>
  )
}

export default App
