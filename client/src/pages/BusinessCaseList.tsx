import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { useBusinessCases } from '../hooks/useBusinessCases';

export default function BusinessCaseList() {
  const { cases, loading, error, createCase, deleteCase } = useBusinessCases();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', description: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.title.trim()) return;
    
    await createCase(newCase);
    setNewCase({ title: '', description: '' });
    setIsModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active': return <Briefcase className="h-5 w-5 text-indigo-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      active: 'Activo',
      completed: 'Completado',
      archived: 'Archivado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Business Cases 📊</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo Business Case
        </button>
      </div>

      {cases.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No tienes business cases aún
          </h3>
          <p className="text-gray-600 mb-6">
            ¡Es hora de crear el primero! Habla con El Jefe para empezar.
          </p>
          <Link to="/assistant" className="btn-primary">
            Hablar con El Jefe 🤘
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((bc) => (
            <Link
              key={bc.id}
              to={`/cases/${bc.id}`}
              className="card hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(bc.status)}
                  <span className="text-sm text-gray-500">{getStatusLabel(bc.status)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm('¿Seguro que quieres eliminar este business case?')) {
                      deleteCase(bc.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 line-clamp-2">{bc.title}</h3>
              
              {bc.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{bc.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{bc._count?.items || 0} ítems</span>
                <span>{new Date(bc.updatedAt).toLocaleDateString('es-ES')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md m-4">
            <h2 className="text-2xl font-bold mb-4">Nuevo Business Case 🚀</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  className="input"
                  placeholder="Ej: App de delivery de tacos"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  className="input h-24 resize-none"
                  placeholder="Describe brevemente tu idea..."
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
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
