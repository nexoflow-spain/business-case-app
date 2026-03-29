import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import businessCasesRouter from './routes/businessCases';
import { chatWithAssistant, getChatHistory } from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/business-cases', businessCasesRouter);
app.post('/api/chat', chatWithAssistant);
app.get('/api/chat/:sessionId', getChatHistory);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '¡Todo chido por aquí! 🚀' });
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor ahuevado corriendo en puerto ${PORT}`);
  console.log('🔥 Listo para crear unos business cases bien chingones');
});
