export const VNC_DATA = {
  profile: {
    name: "Carl Chong",
    company: "NODEGRIP",
    role: "Chief Technology Officer",
    avatar: "/assets/avatar.webp",
    vCard: {
      phone: "+60123456789",
      email: "Y2FybEBub2RlZ3JpcC5jb20=", // Base64 encoded: carl@nodegrip.com
      website: "https://nodegrip.com",
      location: "Kuala Lumpur, Malaysia"
    },
    socials: [
      { id: 'github', icon: 'Github', url: 'https://github.com/carlchong', label: 'GitHub' },
      { id: 'linkedin', icon: 'Linkedin', url: 'https://linkedin.com/in/carlchong', label: 'LinkedIn' },
      { id: 'twitter', icon: 'Twitter', url: 'https://twitter.com/carlchong', label: 'Twitter' },
    ]
  },
  theme: {
    primaryHolo: "linear-gradient(135deg, #ff0080, #7928ca, #0070f3)",
    noiseOpacity: 0.15,
    physics: { stiffness: 260, damping: 20 }
  },
  projects: [
    { id: 1, title: "Neon Dreams", category: "Design System", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, title: "Flux Engine", category: "WebGL Core", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
    { id: 3, title: "Zenith AI", category: "Interface", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop" },
  ],
  skills: ["React", "Next.js", "TypeScript", "WebGL", "Node.js", "Design Systems"]
}
