import { Link } from 'react-router-dom'
import { useUIStore } from '@/application/store/uiStore'

export const Navbar = () => {
  const { sidebarAbierto, alternarSidebar } = useUIStore()

  return (
    <nav className="bg-[#2C3E50] shadow-md sticky top-0 z-40"> 
      <div className="container-custom flex justify-between items-center h-16">
        
        <Link to="/" className="text-2xl font-bold text-white">Alpha Inmobiliaria</Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white/80 hover:text-white transition">Inicio</Link>
          <Link to="/propiedades" className="text-white/80 hover:text-white transition"> Propiedades</Link>
          <Link to="/asesores" className="text-white/80 hover:text-white transition">Asesores</Link>
          <Link to="/login" className="text-white/80 hover:text-white transition">Iniciar Sesión</Link>
        </div>

        <button onClick={alternarSidebar} className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition"  aria-label="Abrir menú">
          <span className={`block w-6 h-0.5 bg-white transition-all ${sidebarAbierto ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${sidebarAbierto ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${sidebarAbierto ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <div className={` fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transition-opacity duration-300 ${sidebarAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={alternarSidebar}>
        <div  className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}`}  onClick={(e) => e.stopPropagation()} >
          <div className="p-4 border-b">
            <Link to="/" className="text-2xl font-bold text-primary">Alpha</Link>
            <button onClick={alternarSidebar} className="float-right text-2xl">×</button>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <Link to="/" className="text-gray-800 hover:text-[#C47B4A] transition" onClick={alternarSidebar}>Inicio</Link>
            <Link to="/propiedades" className="text-gray-800 hover:text-[#C47B4A] transition" onClick={alternarSidebar}>Propiedades</Link>
            <Link to="/asesores" className="text-gray-800 hover:text-[#C47B4A] transition" onClick={alternarSidebar}>Asesores</Link>
            <hr />
            <Link to="/login" className="text-primary hover:underline" onClick={alternarSidebar}>Iniciar Sesión</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
