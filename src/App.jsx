import { Route, Routes } from "react-router-dom"
import Home from "../src/pages/Home"

function App() {

  return (
    <div className="w-screen min-h-screen bg-richblue-100">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
