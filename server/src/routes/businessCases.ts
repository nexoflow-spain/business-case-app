import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET /api/business-cases - Listar todos los business cases
router.get('/', async (req, res) => {
  try {
    const cases = await prisma.businessCase.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener business cases' });
  }
});

// GET /api/business-cases/:id - Obtener un business case con sus ítems
router.get('/:id', async (req, res) => {
  try {
    const businessCase = await prisma.businessCase.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });
    
    if (!businessCase) {
      return res.status(404).json({ error: 'Business case no encontrado' });
    }
    
    res.json(businessCase);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener business case' });
  }
});

// POST /api/business-cases - Crear nuevo business case
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const businessCase = await prisma.businessCase.create({
      data: { title, description }
    });
    
    res.status(201).json(businessCase);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear business case' });
  }
});

// PATCH /api/business-cases/:id - Actualizar business case
router.patch('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const businessCase = await prisma.businessCase.update({
      where: { id: req.params.id },
      data: { title, description, status }
    });
    
    res.json(businessCase);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar business case' });
  }
});

// DELETE /api/business-cases/:id - Eliminar business case
router.delete('/:id', async (req, res) => {
  try {
    await prisma.businessCase.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Business case eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar business case' });
  }
});

// ÍTEMS

// POST /api/business-cases/:id/items - Agregar ítem
router.post('/:id/items', async (req, res) => {
  try {
    const { title, description, category, estimatedValue, probability, priority, dueDate } = req.body;
    
    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        estimatedValue,
        probability,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        businessCaseId: req.params.id
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ítem' });
  }
});

// PATCH /api/business-cases/:id/items/:itemId - Actualizar ítem
router.patch('/:id/items/:itemId', async (req, res) => {
  try {
    const updates = req.body;
    
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date();
    }
    
    const item = await prisma.item.update({
      where: { id: req.params.itemId },
      data: updates
    });
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ítem' });
  }
});

// DELETE /api/business-cases/:id/items/:itemId - Eliminar ítem
router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    await prisma.item.delete({
      where: { id: req.params.itemId }
    });
    
    res.json({ message: 'Ítem eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ítem' });
  }
});

// GET /api/business-cases/:id/stats - Estadísticas del business case
router.get('/:id/stats', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { businessCaseId: req.params.id }
    });
    
    const stats = {
      total: items.length,
      completed: items.filter(i => i.status === 'completed').length,
      pending: items.filter(i => i.status === 'pending').length,
      inProgress: items.filter(i => i.status === 'in-progress').length,
      blocked: items.filter(i => i.status === 'blocked').length,
      totalEstimated: items.reduce((sum, i) => sum + (i.estimatedValue || 0), 0),
      totalActual: items.reduce((sum, i) => sum + (i.actualValue || 0), 0),
      byCategory: {
        revenue: items.filter(i => i.category === 'revenue').length,
        cost: items.filter(i => i.category === 'cost').length,
        resource: items.filter(i => i.category === 'resource').length,
        risk: items.filter(i => i.category === 'risk').length,
        opportunity: items.filter(i => i.category === 'opportunity').length,
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
