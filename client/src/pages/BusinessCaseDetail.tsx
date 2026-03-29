import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, CheckCircle2, Circle, Clock, AlertCircle,
  TrendingUp, TrendingDown, Users, AlertTriangle, Star,
  DollarSign, Calendar
} from 'lucide-react';
import { useBusinessCase } from '../hooks/useBusinessCases';
import { Item } from '../types';

const categoryIcons = {
  revenue: TrendingUp,
  cost: TrendingDown,
  resource: Users,
  risk: AlertTriangle,
  opportunity: Star,
};

const categoryLabels: Record<string, string> = {
  revenue: 'Ingreso',
  cost: 'Costo',
  resource: 'Recurso',
  risk: 'Riesgo',
  opportunity: 'Oportunidad',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const statusIcons = {
  pending: Circle,
  'in-progress': Clock,
  completed: CheckCircle2,
  blocked: AlertCircle,
};

export default function BusinessCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { businessCase, loading, addItem, updateItem, deleteItem } = useBusinessCase(id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    title: '',
    description: '',
    category: 'revenue',
    estimatedValue: 0,
    priority: 'medium',
    status: 'pending',
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title?.trim()) return;
    
    await addItem(newItem);
    setIsModalOpen(false);
    setNewItem({
      title: '',
      description: '',
      category: 'revenue',
      estimatedValue: 0,
      priority: 'medium',
      status: 'pending',
    });
  };

  const toggleItemStatus = async (item: Item) => {
    const newStatus = item.status === 'completed' ? 'pending' : 'completed';
    await updateItem(item.id, { status: newStatus });
  };

  if (loading || !businessCase) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const items = businessCase.items || [];
  const completedCount = items.filter(i => i.status === 'completed').length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{businessCase.title}</h1>
            {businessCase.description && (
              <p className="text-gray-600">{businessCase.description}</p>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Agregar Ítem
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso</span>
            <span className="text-gray-600">{completedCount} de {items.length} completados</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {items.length === 0 ? (
          <div className="card md:col-span-2 text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No hay ítems aún</h3>
            <p className="text-gray-600 mb-4">Agrega ingresos, costos, riesgos y más.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              Agregar primer ítem
            </button>
          </div>
        ) : (
          items.map((item) => {
            const Icon = categoryIcons[item.category];
            const StatusIcon = statusIcons[item.status];
            return (
              <div key={item.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleItemStatus(item)}
                    className={`mt-1 ${item.status === 'completed' ? 'text-green-500' : 'text-gray-400 hover:text-indigo-500'}`}
                  >
                    <StatusIcon className="h-6 w-6" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">{categoryLabels[item.category]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[item.priority]}`}>
                        {item.priority}
                      </span>
                    </div>
                    
                    <h4 className={`font-bold ${item.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {item.title}
                    </h4>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      {item.estimatedValue !== undefined && item.estimatedValue > 0 && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {item.estimatedValue.toLocaleString()}
                        </span>
                      )}
                      {item.dueDate && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar este ítem?')) deleteItem(item.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nuevo Ítem 📝</h2>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="input"
                  placeholder="Ej: Ingresos por suscripciones"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as Item['category'] })}
                    className="input"
                  >
                    <option value="revenue">💰 Ingreso</option>
                    <option value="cost">💸 Costo</option>
                    <option value="resource">👥 Recurso</option>
                    <option value="risk">⚠️ Riesgo</option>
                    <option value="opportunity">⭐ Oportunidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prioridad</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as Item['priority'] })}
                    className="input"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Estimado ($)</label>
                <input
                  type="number"
                  value={newItem.estimatedValue || ''}
                  onChange={(e) => setNewItem({ ...newItem, estimatedValue: parseFloat(e.target.value) || 0 })}
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
