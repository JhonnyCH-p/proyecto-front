import { Routes, Route } from 'react-router-dom'
import { LayoutPublico } from './presentation/components/layout/LayoutPublico'
import { HomePage } from './presentation/pages/public/PrincipalPage'
import { CatalogoPage } from './presentation/pages/public/CatalogoPage'
import { DetallePage } from './presentation/pages/public/DetallePage'
import { AsesoresPage } from './presentation/pages/public/AsesoresPage'
import { ErrorPage } from './presentation/pages/shared/ErrorPage'
import { ChatBot } from '@/presentation/components/chatbot/ChatBot'

function App() {
  return (
    <>
      {/* Enrutamiento principal */}
      <Routes>
        <Route path="/" element={<LayoutPublico />}>
          <Route index element={<HomePage />} />
          <Route path="propiedades" element={<CatalogoPage />} />
          <Route path="propiedad/:id" element={<DetallePage />} />
          <Route path="asesores" element={<AsesoresPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>

      {/* ChatBot flotante visible en toda la aplicación */}
      <ChatBot />
    </>
  )
}

export default App