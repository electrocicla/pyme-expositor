import GlassCard from './ReactBits/GlassCard'
import ParallaxSection from './ReactBits/ParallaxSection'
import AnimatedGradient from './ReactBits/AnimatedGradient'
import FadeIn from './ReactBits/FadeIn'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Palette, Zap, Rocket, Heart } from 'lucide-react'

/**
 * Página de demostración de todos los componentes React Bits
 * Para ver: Navega a /demo en tu app
 */
const DemoPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero with Animated Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGradient
          from="from-indigo-500"
          via="via-purple-500"
          to="to-pink-500"
          speed="normal"
          className="absolute inset-0 opacity-20"
        />
        
        <ParallaxSection speed={0.3}>
          <div className="text-center px-4">
            <FadeIn direction="up" delay={0}>
              <h1 className="text-7xl font-bold text-white mb-6">
                React Bits Demo
              </h1>
            </FadeIn>
            
            <FadeIn direction="up" delay={200}>
              <p className="text-2xl text-white/80 mb-8">
                Componentes espectaculares para tu sitio
              </p>
            </FadeIn>
            
            <FadeIn direction="up" delay={400}>
              <button className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
                Comenzar
              </button>
            </FadeIn>
          </div>
        </ParallaxSection>
      </section>

      {/* Glass Cards Section */}
      <section className="py-24 px-4">
        <FadeIn direction="up">
          <h2 className="text-5xl font-bold text-center text-white mb-16">
            Glass Cards
          </h2>
        </FadeIn>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeIn direction="up" delay={0}>
            <GlassCard blur="xl" opacity={10} border={true} className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4"><Palette className="w-14 h-14 text-white" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Design</h3>
                <p className="text-white/70">
                  Interfaces hermosas y modernas
                </p>
              </div>
            </GlassCard>
          </FadeIn>

          <FadeIn direction="up" delay={100}>
            <GlassCard blur="xl" opacity={10} border={true} glow={true} className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4"><Zap className="w-14 h-14 text-white" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Performance</h3>
                <p className="text-white/70">
                  Rápido y optimizado
                </p>
              </div>
            </GlassCard>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            <GlassCard blur="xl" opacity={10} border={true} className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4"><Rocket className="w-14 h-14 text-white" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Deploy</h3>
                <p className="text-white/70">
                  Listo para producción
                </p>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <ParallaxSection speed={0.2}>
            <FadeIn direction="up">
              <h2 className="text-5xl font-bold text-white text-center mb-8">
                Parallax Effect
              </h2>
              <p className="text-xl text-white/70 text-center leading-relaxed">
                Este contenido se mueve más lento que el scroll, creando una sensación de profundidad.
                Perfecto para headers, imágenes hero y secciones destacadas.
              </p>
            </FadeIn>
          </ParallaxSection>
        </div>
      </section>

      {/* FadeIn Directions */}
      <section className="py-24 px-4">
        <FadeIn direction="up">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Fade In Directions
          </h2>
        </FadeIn>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FadeIn direction="up" delay={0}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4"><ArrowUp className="w-10 h-10 text-white" /></div>
              <p className="text-white font-semibold">From Bottom</p>
            </div>
          </FadeIn>

          <FadeIn direction="down" delay={100}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4"><ArrowDown className="w-10 h-10 text-white" /></div>
              <p className="text-white font-semibold">From Top</p>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={200}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4"><ArrowLeft className="w-10 h-10 text-white" /></div>
              <p className="text-white font-semibold">From Right</p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={300}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4"><ArrowRight className="w-10 h-10 text-white" /></div>
              <p className="text-white font-semibold">From Left</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Animated Gradient Backgrounds */}
      <section className="py-24 px-4">
        <FadeIn direction="up">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Animated Gradients
          </h2>
        </FadeIn>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeIn direction="up" delay={0}>
            <AnimatedGradient
              from="from-blue-500"
              via="via-cyan-500"
              to="to-teal-500"
              speed="fast"
              className="h-64 rounded-2xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-2xl">Fast</span>
            </AnimatedGradient>
          </FadeIn>

          <FadeIn direction="up" delay={100}>
            <AnimatedGradient
              from="from-purple-500"
              via="via-pink-500"
              to="to-red-500"
              speed="normal"
              className="h-64 rounded-2xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-2xl">Normal</span>
            </AnimatedGradient>
          </FadeIn>

          <FadeIn direction="up" delay={200}>
            <AnimatedGradient
              from="from-green-500"
              via="via-emerald-500"
              to="to-lime-500"
              speed="slow"
              className="h-64 rounded-2xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-2xl">Slow</span>
            </AnimatedGradient>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 text-center">
        <FadeIn direction="up">
          <p className="flex items-center justify-center gap-2 text-white/60">
            Powered by React Bits <Heart className="w-4 h-4 text-purple-400" />
          </p>
        </FadeIn>
      </section>
    </div>
  )
}

export default DemoPage
