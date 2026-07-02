import { useState } from 'react'
import { Modal } from '@/presentation/components/ui/Modal'

interface GaleriaImagenesProps {
  imagenes: string[]
  titulo: string
}

export const GaleriaImagenes = ({ imagenes, titulo }: GaleriaImagenesProps) => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState<number>(0)
  const [modalAbierto, setModalAbierto] = useState(false)

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Sin imágenes disponibles</p>
      </div>
    )
  }

  const imagenPrincipal = imagenes[imagenSeleccionada] || imagenes[0]

  const handleImagenClick = (index: number) => {
    setImagenSeleccionada(index)
  }

  const handleAmpliar = () => {
    setModalAbierto(true)
  }

  return (
    <div>
      {/* Imagen principal */}
      <div
        className="relative rounded-lg overflow-hidden bg-gray-200 cursor-pointer group"
        onClick={handleAmpliar}
      >
        <img
          src={imagenPrincipal}
          alt={titulo}
          className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black/50 px-3 py-1 rounded transition-opacity duration-300">
            Clic para ampliar
          </span>
        </div>
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {imagenes.map((img, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden bg-gray-200 cursor-pointer h-20 ${
                index === imagenSeleccionada ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleImagenClick(index)}
            >
              <img
                src={img}
                alt={`${titulo} - Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal de vista ampliada */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} title={titulo}>
        <div className="flex flex-col items-center">
          <img
            src={imagenPrincipal}
            alt={titulo}
            className="w-full max-h-[70vh] object-contain rounded-lg"
          />
          {imagenes.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto w-full justify-center">
              {imagenes.map((img, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-lg overflow-hidden bg-gray-200 cursor-pointer flex-shrink-0 ${
                    index === imagenSeleccionada ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleImagenClick(index)}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}