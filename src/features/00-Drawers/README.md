# Drawers System

Sistemul de drawers pentru CMS Frontend, configurat pentru a folosi API-ul simplificat `openDrawer('mode', 'type', 'data')`.

## API Simplificată

### Funcția principală: `openDrawer(mode, type, data, options)`

```javascript
import { openDrawer, DRAWER_MODES, DRAWER_TYPES } from '@/features/00-Drawers';

// Deschide un drawer pentru editare
openDrawer('edit', 'appointment', appointmentData, {
  onSave: handleSave,
  onDelete: handleDelete,
  onCancel: handleCancel
});

// Deschide un drawer pentru creare
openDrawer('create', 'stock', null, {
  onSave: handleSave,
  onCancel: handleCancel
});
```

### Parametri

- **mode** (string): `'create'` sau `'edit'`
- **type** (string): Tipul drawer-ului (vezi DRAWER_TYPES)
- **data** (object): Datele pentru editare (null pentru create)
- **options** (object): Opțiuni suplimentare

### Opțiuni disponibile

```javascript
{
  title: 'Custom Title',        // Titlu personalizat
  size: 'small|medium|large',   // Dimensiunea drawer-ului
  onSave: (data, mode) => {},   // Callback pentru salvare
  onDelete: (data) => {},       // Callback pentru ștergere
  onCancel: () => {}            // Callback pentru anulare
}
```

## Tipuri de Drawers

### DRAWER_TYPES

```javascript
export const DRAWER_TYPES = {
  TIMELINE: 'timeline',        // Programări/Rezervări
  STOCK: 'stock',              // Stocuri
  MEMBER: 'member',            // Membri staff
  SERVICE: 'service',          // Servicii
  AI_ASSISTANT: 'ai-assistant' // Asistent AI
};
```

### DRAWER_MODES

```javascript
export const DRAWER_MODES = {
  CREATE: 'create',  // Creare nou
  EDIT: 'edit'       // Editare existent
};
```

## Formulare Disponibile

### 1. TimelineForm
Pentru programări, rezervări și sesiuni (configurate în funcție de business type).

**Câmpuri (Dental Clinic):**
- patientName, phoneNumber, email
- date, time, duration
- treatmentType, medicId
- notes

**Câmpuri (Gym):**
- clientName, phoneNumber, email
- date, time, duration
- sessionType, trainerId
- notes

**Câmpuri (Hotel):**
- guestName, phoneNumber, email
- checkIn, checkOut
- roomType, guests
- specialRequests

### 2. ServiceForm
Pentru servicii, tratamente și pachete.

**Câmpuri:**
- name
- price
- duration
- category/type
- description

### 3. StockForm
Pentru gestionarea stocurilor.

**Câmpuri:**
- name
- code
- category
- quantity
- currentPrice
- minQuantity
- description

### 4. MemberForm
Pentru membrii staff.

**Câmpuri:**
- name
- email
- phone
- role
- workDays
- photoUrl

## Utilizare în Componente

### Folosind hook-ul useDrawer

```javascript
import { useDrawer } from '@/features/00-Drawers';

const MyComponent = () => {
  const { openTimelineDrawer, openStockDrawer } = useDrawer();

  const handleEditTimeline = () => {
    openTimelineDrawer('edit', timelineData, {
      onSave: async (data) => {
        await updateTimeline(data);
      }
    });
  };

  const handleCreateStock = () => {
    openStockDrawer('create', null, {
      onSave: async (data) => {
        await createStock(data);
      }
    });
  };

  return (
    <div>
      <button onClick={handleEditTimeline}>Edit Timeline</button>
      <button onClick={handleCreateStock}>Add Stock</button>
    </div>
  );
};
```

### Folosind funcția directă

```javascript
import { openDrawer, DRAWER_MODES, DRAWER_TYPES } from '@/features/00-Drawers';

const handleOpenDrawer = () => {
  openDrawer(DRAWER_MODES.EDIT, DRAWER_TYPES.TIMELINE, timelineData, {
    onSave: handleSaveTimeline,
    onDelete: handleDeleteTimeline
  });
};
```

## Integrare în App

### 1. Adaugă DrawerManager în App.jsx

```javascript
import { DrawerManager } from '@/features/00-Drawers';

function App() {
  return (
    <div className="App">
      {/* Restul aplicației */}
      <DrawerManager />
    </div>
  );
}
```

### 2. Folosește în componente

```javascript
// În orice componentă
import { openDrawer } from '@/features/00-Drawers';

const handleEdit = () => {
  openDrawer('edit', 'timeline', timelineData);
};
```

## Callbacks

### onSave(data, mode)
```javascript
const handleSave = async (data, mode) => {
  if (mode === 'create') {
    await createItem(data);
  } else {
    await updateItem(data);
  }
};
```

### onDelete(data)
```javascript
const handleDelete = async (data) => {
  await deleteItem(data.id);
};
```

### onCancel()
```javascript
const handleCancel = () => {
  console.log('Operation cancelled');
};
```

## Stiluri și Layout

Drawer-urile folosesc `DrawerLayout` care oferă:
- Animații de deschidere/închidere
- Overlay pentru focus
- Responsive design
- Loading states
- Titlu și acțiuni

## Exemple Complete

### Editare Timeline
```javascript
openDrawer('edit', 'timeline', {
  id: 1,
  patientName: 'John Doe',
  phoneNumber: '0712 345 678',
  date: '2024-01-15',
  time: '10:00',
  treatmentType: 'Cleaning',
  medicId: 1,
  notes: 'Regular checkup'
}, {
  onSave: async (data) => {
    await updateTimeline(data);
    toast.success('Timeline updated!');
  },
  onDelete: async (data) => {
    await deleteTimeline(data.id);
    toast.success('Timeline deleted!');
  }
});
```

### Creare Stock
```javascript
openDrawer('create', 'stock', null, {
  onSave: async (data) => {
    await createStock(data);
    toast.success('Stock item created!');
  }
});
```

## Note Importante

1. **AI Assistant**: Nu se modifică - rămâne neschimbat
2. **Validare**: Se face în formulare, nu în store
3. **State Management**: Folosește Zustand pentru state global
4. **Performance**: Un singur drawer activ (cu excepția AI Assistant)
5. **Error Handling**: Se face în callbacks, nu în store 