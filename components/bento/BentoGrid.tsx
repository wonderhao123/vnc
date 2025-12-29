'use client';

import { VNC_DATA } from '@/lib/vnc-config';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full overflow-y-auto">
      {/* Welcome / Intro Tile */}
      <motion.div 
        className="col-span-1 md:col-span-2 row-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Welcome</h3>
        <p className="text-white/60">
          Exploring the intersection of digital physics and interface design. 
          This portfolio is a living experiment in sensory web experiences.
        </p>
      </motion.div>

      {/* Skills Tile */}
      <motion.div 
        className="col-span-1 row-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-white mb-4">Stack</h3>
        <div className="flex flex-wrap gap-2">
          {VNC_DATA.skills.map((skill) => (
            <span key={skill} className="px-2 py-1 text-xs rounded-md bg-white/10 text-white/80 border border-white/5">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Projects */}
      {VNC_DATA.projects.map((project, i) => (
        <motion.div
          key={project.id}
          className={`col-span-1 ${i === 0 ? 'md:col-span-2' : ''} row-span-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md group relative h-64`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          {/* Image Placeholder */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-mono text-blue-400 mb-1">{project.category}</p>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
              </div>
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Social Feed / Status */}
      <motion.div 
        className="col-span-1 row-span-1 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-green-400">AVAILABLE FOR WORK</span>
        </div>
        <p className="text-white/80 text-sm mt-4">
          Currently building next-gen interfaces for AI agents.
        </p>
      </motion.div>
    </div>
  );
}
