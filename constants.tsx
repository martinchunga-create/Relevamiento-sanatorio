
import { InspectionArea } from './types';

export const INITIAL_AREAS: InspectionArea[] = [
  {
    id: '101',
    name: 'Habitación 101',
    type: 'room',
    floor: 1,
    progress: 0,
    items: [
      { id: '101-1', label: 'Cama Articulada', status: 'pending' },
      { id: '101-2', label: 'Luz de Cabecera', status: 'pending' },
      { id: '101-3', label: 'Panel de Gases', status: 'pending' },
      { id: '101-4', label: 'Aire Acondicionado', status: 'pending' },
      { id: '101-5', label: 'Baño: Grifería', status: 'pending' },
    ]
  },
  {
    id: '102',
    name: 'Habitación 102',
    type: 'room',
    floor: 1,
    progress: 100,
    lastInspected: '2023-10-25',
    items: [
      { id: '102-1', label: 'Cama Articulada', status: 'good' },
      { id: '102-2', label: 'Luz de Cabecera', status: 'good' },
      { id: '102-3', label: 'Panel de Gases', status: 'good' },
      { id: '102-4', label: 'Aire Acondicionado', status: 'fair', comment: 'Hace ruido leve' },
      { id: '102-5', label: 'Baño: Grifería', status: 'good' },
    ]
  },
  {
    id: 'C1',
    name: 'Sala de Espera PB',
    type: 'common',
    floor: 0,
    progress: 0,
    items: [
      { id: 'C1-1', label: 'Tandems de Sillas', status: 'pending' },
      { id: 'C1-2', label: 'Dispensador Agua', status: 'pending' },
      { id: 'C1-3', label: 'Iluminación General', status: 'pending' },
      { id: 'C1-4', label: 'Puertas Automáticas', status: 'pending' },
    ]
  },
  {
    id: 'S1',
    name: 'Office de Enfermería 1',
    type: 'service',
    floor: 1,
    progress: 0,
    items: [
      { id: 'S1-1', label: 'Heladera Medicamentos', status: 'pending' },
      { id: 'S1-2', label: 'Mesada Acero', status: 'pending' },
      { id: 'S1-3', label: 'Stock Insumos', status: 'pending' },
    ]
  }
];
