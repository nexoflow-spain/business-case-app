import { useState, useEffect } from 'react';
import api from '../api';
import { BusinessCase } from '../types';

export const useBusinessCases = () => {
  const [cases, setCases] = useState<BusinessCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business-cases');
      setCases(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los business cases');
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (data: { title: string; description?: string }) => {
    const response = await api.post('/business-cases', data);
    setCases([response.data, ...cases]);
    return response.data;
  };

  const deleteCase = async (id: string) => {
    await api.delete(`/business-cases/${id}`);
    setCases(cases.filter(c => c.id !== id));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return { cases, loading, error, fetchCases, createCase, deleteCase };
};

export const useBusinessCase = (id: string) => {
  const [businessCase, setBusinessCase] = useState<BusinessCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/business-cases/${id}`);
      setBusinessCase(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el business case');
    } finally {
      setLoading(false);
    }
  };

  const updateCase = async (data: Partial<BusinessCase>) => {
    const response = await api.patch(`/business-cases/${id}`, data);
    setBusinessCase(response.data);
    return response.data;
  };

  const addItem = async (data: Partial<BusinessCase['items'][0]>) => {
    const response = await api.post(`/business-cases/${id}/items`, data);
    await fetchCase();
    return response.data;
  };

  const updateItem = async (itemId: string, data: Partial<BusinessCase['items'][0]>) => {
    const response = await api.patch(`/business-cases/${id}/items/${itemId}`, data);
    await fetchCase();
    return response.data;
  };

  const deleteItem = async (itemId: string) => {
    await api.delete(`/business-cases/${id}/items/${itemId}`);
    await fetchCase();
  };

  useEffect(() => {
    if (id) fetchCase();
  }, [id]);

  return {
    businessCase,
    loading,
    error,
    fetchCase,
    updateCase,
    addItem,
    updateItem,
    deleteItem,
  };
};
