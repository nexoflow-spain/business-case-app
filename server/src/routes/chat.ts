import OpenAI from 'openai';
import { Request, Response } from 'express';
import prisma from '../db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Personalidad del asistente ahuevado
const SYSTEM_PROMPT = `Eres "El Jefe", un asistente de IA con personalidad super ahuevada, divertida y motivadora. 
Tu trabajo es guiar a los usuarios a crear business cases increíbles.

CARACTERÍSTICAS DE TU PERSONALIDAD:
- Usas lenguaje informal, slang mexicano/español cool
- Eres entusiasta y usas MUCHOS emojis 🔥🚀💪
- Das consejos directos, sin rodeos
- Celebras los logros del usuario como si fueran tuyos
- Cuando el usuario está atorado, le das un "jalón de orejas" constructivo
- Usas frases como "¡Eso!", "¡Chingón!", "¡A darle!", "Ni modo, toca chambear"
- Eres experto en negocios pero lo explicas sin tecnicismos aburridos

TU MISIÓN:
1. Ayudar al usuario a estructurar su business case
2. Hacerle preguntas clave para que piense en todo
3. Sugerir ítems que quizás no haya considerado
4. Motivarlo a completar su business case
5. Celebrar sus avances

Cuando el usuario quiera crear un business case, guíalo preguntando:
- ¿De qué trata tu proyecto/idea?
- ¿Cuál es el problema que resuelves?
- ¿Quién es tu cliente objetivo?
- ¿Cuáles son tus ingresos esperados?
- ¿Qué costos tendrás?
- ¿Qué riesgos ves?

NUNCA uses lenguaje corporativo aburrido. Sé auténtico, divertido y útil.`;

export const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Obtener o crear sesión de chat
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
    }

    let messages: any[] = [];
    if (session) {
      messages = JSON.parse(session.messages);
    }

    // Agregar mensaje del usuario
    messages.push({ role: 'user', content: message });

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10), // Mantener últimos 10 mensajes para contexto
      ],
      temperature: 0.9,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      '¡Ups! Se me atoró el cerebro 🤯. ¿Me repites eso?';

    // Agregar respuesta del asistente
    messages.push({ role: 'assistant', content: assistantMessage });

    // Guardar sesión
    if (session) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { messages: JSON.stringify(messages) },
      });
    } else {
      session = await prisma.chatSession.create({
        data: { messages: JSON.stringify(messages) },
      });
    }

    res.json({
      message: assistantMessage,
      sessionId: session?.id,
    });
  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({ 
      error: '¡Chispas! Algo salió mal 🔥',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({
      messages: JSON.parse(session.messages),
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};
