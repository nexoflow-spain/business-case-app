import { Brain, ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <Brain className="h-24 w-24 text-indigo-600 animate-bounce-slow" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900">
          ¡Crea Business Cases que Rompen el Internet! 🚀
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Convierte tus ideas en negocios sólidos con la ayuda de{' '}
          <span className="text-indigo-600 font-bold">El Jefe</span>, tu asistente IA 
          ahuevado que te guiará paso a paso.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/assistant" className="btn-primary flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Hablar con El Jefe
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/cases" className="btn-secondary text-lg">
            Ver mis Business Cases
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="card hover:shadow-xl transition-shadow">
          <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Brain className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Asistente IA Ahuevado 🤘</h3>
          <p className="text-gray-600">
            El Jefe te guiará con humor y actitud para crear business cases bien chingones.
            Sin tecnicismos aburridos.
          </p>
        </div>

        <div className="card hover:shadow-xl transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Seguimiento Pro 💪</h3>
          <p className="text-gray-600">
            Gestiona ingresos, costos, riesgos y oportunidades. Visualiza tu progreso
            y mantén todo bajo control.
          </p>
        </div>

        <div className="card hover:shadow-xl transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Análisis Inteligente 🧠</h3>
          <p className="text-gray-600">
            Obtén insights y recomendaciones basadas en tus datos. Toma decisiones
            informadas como un verdadero jefe.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-indigo-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">¿Cómo funciona? 🔥</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Platica con El Jefe', desc: 'Cuéntale tu idea y te ayudará a estructurarla' },
            { step: '2', title: 'Crea tu Business Case', desc: 'Define ingresos, costos, riesgos y más' },
            { step: '3', title: 'Haz Seguimiento', desc: 'Actualiza el progreso de cada ítem' },
            { step: '4', title: '¡Triunfa!', desc: 'Toma decisiones basadas en datos sólidos' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
