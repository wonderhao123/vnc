'use client';

import { VNC_DATA } from '@/lib/vnc-config';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Code2, Rocket, ArrowDownRightFromCircleIcon, ArrowUpRightFromCircle, Link } from 'lucide-react';
import { GlowingCard } from '@/components/ui/GlowingCard';

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full overflow-y-auto">
      {/* Welcome / Intro Tile - Hero Card */}
      <GlowingCard
        className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl relative group"
        glowColor="rgba(100, 200, 255, 0.6)"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Featured</span>
          </div>
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Welcome to the Future
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Exploring the intersection of digital physics and interface design.
            This portfolio is a living experiment in sensory web experiences.
          </p>

          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
          </div>
        </motion.div>
      </GlowingCard>

      {/* Skills Tile - Enhanced with gradient */}
      <GlowingCard
        className="col-span-1 row-span-1 bg-gradient-to-br from-purple-950/40 via-pink-950/30 to-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl relative"
        glowColor="rgba(200, 100, 255, 0.6)"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Tech Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {VNC_DATA.skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="px-3 py-1.5 text-xs rounded-lg bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/30 transition-all cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </GlowingCard>

      {/* Projects */}
      {VNC_DATA.projects.map((project, i) => (
        <GlowingCard
          key={project.id}
          className={`col-span-1 ${i === 0 ? 'md:col-span-2' : ''} row-span-1 bg-gradient-to-br from-slate-950/60 via-gray-950/40 to-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl group relative h-64 cursor-pointer`}
          glowColor={i === 0 ? 'rgba(100, 200, 255, 0.5)' : 'rgba(150, 100, 255, 0.5)'}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="relative h-full"
          >
            {/* Image with parallax effect */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${project.image})` }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />

            <div className="absolute bottom-0 left-0 p-6 w-full z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                    <p className="text-xs font-mono text-blue-400 uppercase tracking-wider">{project.category}</p>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <motion.div
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-black transition-all"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </GlowingCard>
      ))}

      {/* Social Feed / Status - Enhanced */}
      <GlowingCard
        className="col-span-1 row-span-1 bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-black/40 border border-green-500/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden"
        glowColor="rgba(100, 255, 200, 0.5)"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-500/50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-mono text-green-400 uppercase tracking-wider">Open for Strategic Partnerships</span>
          </div>
          <div className='grid gap-2'>
            <div className="flex items-start gap-2">
              <Rocket className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-white/90 text-sm leading-relaxed">
                Empowering Businesses via Digital Transformation.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowUpRightFromCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-white/90 text-sm leading-relaxed">
                Turning Visionary Ideas into Refined, Scalable Products.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Link className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-white/90 text-sm leading-relaxed">
                Bridging the Gap between High-End Aesthetics and Robust Engineering.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(100, 255, 200, 0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
          animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </GlowingCard>
    </div>
  );
}
