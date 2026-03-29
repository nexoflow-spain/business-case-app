import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, Trash2 } from 'lucide-react';
import api from '../api';
import { ChatMessage } from '../types';

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Qué onda, jefe! 🤘 Soy El Jefe, tu asistente para crear business cases bien chingones.\n\n¿Qué idea traes? Cuéntame todo y te ayudo a estructurarla.\n\nPuedo ayudarte con:\n• 💰 Proyecciones de ingresos\n• 💸 Análisis de costos\n• ⚠️ Identificación de riesgos\n• ⭐ Oportunidades de crecimiento\n\n¿Por dónde empezamos? 🔥'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/chat', {
        message: userMessage,
        sessionId,
      });

      setSessionId(response.data.sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '¡Chale! Se me cruzó el cable 🤯. ¿Me repites eso?'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '¡Conversación reiniciada! ¿Qué business case vamos a armar? 🤘'
    }]);
    setSessionId(undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-full">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">El Jefe 🤘</h1>
            <p className="text-sm text-gray-600">Tu asistente IA ahuevado</p>
          </div>
        </div>
        
        <button
          onClick={clearChat}
          className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm"
        >
          <Trash2 className="h-4 w-4" />
          Reiniciar
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-300'
            }`}>
              {msg.role === 'user' ? (
                <User className="h-5 w-5 text-white" />
              ) : (
                <Bot className="h-5 w-5 text-gray-700" />
              )}
            </div>
            
            <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white shadow-sm rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="bg-gray-300 p-2 rounded-full">
              <Bot className="h-5 w-5 text-gray-700" />
            </div>
            <div className="bg-white shadow-sm p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              <span className="text-gray-600">El Jefe está pensando... 🤔</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje... (Shift+Enter para nueva línea)"
          className="flex-1 input resize-none min-h-[60px] max-h-[120px]"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-primary px-4 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        El Jefe usa GPT-4. Las respuestas son orientativas, ¡siempre valida con expertos! 🚀
      </p>
    </div>
  );
}
