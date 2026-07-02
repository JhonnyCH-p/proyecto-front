import { Asesor } from '@/domain/entities/Asesor'

export const asesoresMock: Asesor[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@alphainmobiliaria.com',
    telefono: '0991234567',
    fotografia: 'https://i.pravatar.cc/300?img=1',
    especialidad: 'Ventas de lujo',
    experiencia: 8,
    creadoEn: new Date(),
  },
  {
    id: '2',
    nombre: 'Ana',
    apellido: 'López',
    email: 'ana@alphainmobiliaria.com',
    telefono: '0997654321',
    fotografia: 'https://i.pravatar.cc/300?img=5',
    especialidad: 'Ventas y alquiler residencial',
    experiencia: 5,
    creadoEn: new Date(),
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Ruiz',
    email: 'carlos@alphainmobiliaria.com',
    telefono: '0991122334',
    fotografia: 'https://i.pravatar.cc/300?img=12',
    especialidad: 'Terrenos y proyectos',
    experiencia: 10,
    creadoEn: new Date(),
  },
]