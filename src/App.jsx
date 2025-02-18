import { BrowserRouter, Routes } from "react-router-dom"
import { renderRoutes } from './routes'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* localhost:5173 - HomeTemplates */}
        {renderRoutes()}
      </Routes>
    </BrowserRouter>
      
  )
}
