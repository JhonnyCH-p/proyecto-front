export interface Ubicacion {
  direccion: string
  ciudad: string
  latitud: number
  longitud: number
}

export interface Propiedad {
  id: string
  titulo: string
  descripcion: string
  precio: number
  tipoTransaccion: 'venta' | 'alquiler'
  tipoInmueble: 'casa' | 'departamento' | 'terreno' | 'oficina'
  habitaciones: number
  banos: number
  areaTotal: number
  destacada: boolean
  publicada: boolean
  asesorId: string
  ubicacion: Ubicacion
  imagenes: string[]
  creadoEn: Date
}