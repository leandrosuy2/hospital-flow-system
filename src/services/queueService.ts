
import { Department, Queue, QueueItem } from "@/types";

// Dados mockados para departamentos
const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Pronto-Socorro',
    description: 'Atendimento de emergência',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Clínica Médica',
    description: 'Atendimento clínico geral',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Pediatria',
    description: 'Atendimento para crianças',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

// Dados mockados para filas
const initialQueues: Queue[] = [
  {
    id: '1',
    name: 'Triagem PS',
    description: 'Fila de triagem do Pronto-Socorro',
    departmentId: '1',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Consultas PS',
    description: 'Fila de consultas do Pronto-Socorro',
    departmentId: '1',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Triagem Clínica',
    description: 'Fila de triagem da Clínica Médica',
    departmentId: '2',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Consultas Pediatria',
    description: 'Fila de consultas da Pediatria',
    departmentId: '3',
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
];

// Dados mockados para itens de fila
const initialQueueItems: QueueItem[] = [
  {
    id: '1',
    patientId: '1',
    queueId: '1',
    position: 1,
    status: 'WAITING',
    notes: 'Febre alta',
    metadata: { priority: 'alta', waitingSince: '09:15' },
    createdAt: '2023-10-10T09:15:00.000Z',
    updatedAt: '2023-10-10T09:15:00.000Z'
  },
  {
    id: '2',
    patientId: '2',
    queueId: '1',
    position: 2,
    status: 'WAITING',
    notes: 'Dor abdominal',
    metadata: { priority: 'média', waitingSince: '09:30' },
    createdAt: '2023-10-10T09:30:00.000Z',
    updatedAt: '2023-10-10T09:30:00.000Z'
  },
  {
    id: '3',
    patientId: '3',
    queueId: '2',
    position: 1,
    status: 'IN_PROGRESS',
    notes: 'Consulta em andamento',
    metadata: { priority: 'normal', waitingSince: '10:00' },
    createdAt: '2023-10-10T10:00:00.000Z',
    updatedAt: '2023-10-10T10:15:00.000Z'
  },
];

// Inicializar localStorage com dados mockados (apenas se não existirem)
const initializeStorage = () => {
  if (!localStorage.getItem('departments')) {
    localStorage.setItem('departments', JSON.stringify(initialDepartments));
  }
  
  if (!localStorage.getItem('queues')) {
    localStorage.setItem('queues', JSON.stringify(initialQueues));
  }
  
  if (!localStorage.getItem('queueItems')) {
    localStorage.setItem('queueItems', JSON.stringify(initialQueueItems));
  }
};

// Inicializar na primeira execução
initializeStorage();

// Funções para departamentos
export const getDepartments = (): Department[] => {
  const departments = localStorage.getItem('departments');
  return departments ? JSON.parse(departments) : [];
};

export const getDepartmentById = (id: string): Department | undefined => {
  const departments = getDepartments();
  return departments.find(dept => dept.id === id);
};

export const createDepartment = (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Department => {
  const departments = getDepartments();
  const newDepartment: Department = {
    ...department,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  departments.push(newDepartment);
  localStorage.setItem('departments', JSON.stringify(departments));
  return newDepartment;
};

export const updateDepartment = (id: string, data: Partial<Department>): Department | undefined => {
  const departments = getDepartments();
  const index = departments.findIndex(dept => dept.id === id);
  
  if (index === -1) return undefined;
  
  const updatedDepartment = {
    ...departments[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  departments[index] = updatedDepartment;
  localStorage.setItem('departments', JSON.stringify(departments));
  return updatedDepartment;
};

export const deleteDepartment = (id: string): boolean => {
  const departments = getDepartments();
  const filteredDepartments = departments.filter(dept => dept.id !== id);
  
  if (filteredDepartments.length === departments.length) return false;
  
  localStorage.setItem('departments', JSON.stringify(filteredDepartments));
  return true;
};

// Funções para filas
export const getQueues = (): Queue[] => {
  const queues = localStorage.getItem('queues');
  const queuesData = queues ? JSON.parse(queues) : [];
  
  // Adicionar informações do departamento a cada fila
  return queuesData.map((queue: Queue) => {
    const department = getDepartmentById(queue.departmentId);
    return { ...queue, department };
  });
};

export const getQueueById = (id: string): Queue | undefined => {
  const queues = getQueues();
  return queues.find(queue => queue.id === id);
};

export const createQueue = (queue: Omit<Queue, 'id' | 'createdAt' | 'updatedAt'>): Queue => {
  const queues = getQueues().map(q => ({ ...q })); // Remove department property for storage
  
  const newQueue: Queue = {
    ...queue,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Remove department property from storage
  const { department, ...queueToStore } = newQueue as Queue & { department?: Department };
  
  queues.push(queueToStore);
  localStorage.setItem('queues', JSON.stringify(queues));
  
  // Return with department for UI
  newQueue.department = getDepartmentById(queue.departmentId);
  return newQueue;
};

export const updateQueue = (id: string, data: Partial<Queue>): Queue | undefined => {
  const queues = getQueues().map(q => {
    // Remover propriedade department para armazenamento
    const { department, ...queueData } = q;
    return queueData;
  });
  
  const index = queues.findIndex(queue => queue.id === id);
  
  if (index === -1) return undefined;
  
  const updatedQueue = {
    ...queues[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  queues[index] = updatedQueue;
  localStorage.setItem('queues', JSON.stringify(queues));
  
  // Retornar com o departamento para a UI
  updatedQueue.department = getDepartmentById(updatedQueue.departmentId);
  return updatedQueue;
};

export const deleteQueue = (id: string): boolean => {
  const queues = getQueues().map(q => {
    // Remove department property for storage
    const { department, ...queueData } = q;
    return queueData;
  });
  
  const filteredQueues = queues.filter(queue => queue.id !== id);
  
  if (filteredQueues.length === queues.length) return false;
  
  localStorage.setItem('queues', JSON.stringify(filteredQueues));
  
  // Also delete all queue items for this queue
  const queueItems = getQueueItems();
  const filteredItems = queueItems.filter(item => item.queueId !== id);
  localStorage.setItem('queueItems', JSON.stringify(filteredItems));
  
  return true;
};

// Funções para itens de fila
export const getQueueItems = (): QueueItem[] => {
  const items = localStorage.getItem('queueItems');
  return items ? JSON.parse(items) : [];
};

export const getQueueItemById = (id: string): QueueItem | undefined => {
  const items = getQueueItems();
  return items.find(item => item.id === id);
};

export const getQueueItemsByQueueId = (queueId: string): QueueItem[] => {
  const items = getQueueItems();
  
  // Import patient service to get patient data
  const { getPatientById } = require('./patientService');
  
  return items
    .filter(item => item.queueId === queueId)
    .map(item => {
      // Add patient data to queue item
      const patient = getPatientById(item.patientId);
      return { ...item, patient };
    })
    .sort((a, b) => a.position - b.position);
};

export const createQueueItem = (queueItem: Omit<QueueItem, 'id' | 'createdAt' | 'updatedAt' | 'position'>): QueueItem => {
  const items = getQueueItems();
  
  // Calculate position (last position + 1)
  const queueItems = items.filter(item => item.queueId === queueItem.queueId);
  const lastPosition = queueItems.length > 0 
    ? Math.max(...queueItems.map(item => item.position))
    : 0;
  
  const newItem: QueueItem = {
    ...queueItem,
    position: lastPosition + 1,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  items.push(newItem);
  localStorage.setItem('queueItems', JSON.stringify(items));
  
  // Import patient service to get patient data
  const { getPatientById } = require('./patientService');
  newItem.patient = getPatientById(queueItem.patientId);
  
  return newItem;
};

export const updateQueueItem = (id: string, data: Partial<QueueItem>): QueueItem | undefined => {
  const items = getQueueItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return undefined;
  
  const updatedItem = {
    ...items[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  items[index] = updatedItem;
  localStorage.setItem('queueItems', JSON.stringify(items));
  
  // Import patient service to get patient data
  const { getPatientById } = require('./patientService');
  updatedItem.patient = getPatientById(updatedItem.patientId);
  
  return updatedItem;
};

export const deleteQueueItem = (id: string): boolean => {
  const items = getQueueItems();
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  localStorage.setItem('queueItems', JSON.stringify(filteredItems));
  return true;
};

export const updateQueueItemStatus = (id: string, status: QueueItem['status']): QueueItem | undefined => {
  return updateQueueItem(id, { status });
};

// Função para adicionar paciente à fila
export const addPatientToQueue = (
  queueId: string,
  patientId: string,
  priority: string = 'normal',
  notes: string = ''
): QueueItem | undefined => {
  const queue = getQueueById(queueId);
  if (!queue) return undefined;
  
  const now = new Date();
  const waitingSince = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const newItem = createQueueItem({
    patientId,
    queueId,
    status: 'WAITING',
    notes,
    metadata: {
      priority,
      waitingSince
    }
  });
  
  return newItem;
};
