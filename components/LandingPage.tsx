'use client'

import { motion, useScroll, useTransform, useAnimation, useInView, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Mail, Moon, Sun, DownloadIcon, ExternalLink, ChevronRight, ChevronDown, Box, Globe, Users, Layers, ArrowDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import "@/styles/fonts.css"
import { cn } from "@/lib/utils"

// Meteors component
const Meteors = ({ number }: { number: number }) => {
  const meteors = [...Array(number)].map((_, index) => (
    <span
      key={index}
      className="animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 1}s`,
        animationDuration: `${Math.random() * 1 + 0.5}s`,
      }}
    />
  ))

  return <>{meteors}</>
}

// MagicUIBlurFade component
const MagicUIBlurFade = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, filter: "blur(0px)" })
    } else {
      controls.start({ opacity: 0, filter: "blur(10px)" })
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={controls}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// CustomTooltip component
const CustomTooltip: React.FC<{ children: React.ReactNode; content: React.ReactNode }> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsVisible(true)
    updatePosition(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVisible) {
      updatePosition(e)
    }
  }

  const updatePosition = (e: React.MouseEvent) => {
    const x = e.clientX + 10 // 10px to the right of the cursor
    const y = e.clientY - 10 // 10px above the cursor
    setPosition({ x, y })
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <span
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden transform -translate-y-full">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// TreeNode component
const TreeNode: React.FC<{ node: TreeNode; level?: number; isDarkMode: boolean }> = ({ node, level = 0, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(level === 0)
  const hasChildren = node.children && node.children.length > 0

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Graphic Design':
        return <Box className="w-5 h-5 mr-2 text-green-500" />
      case 'Web Design':
        return <Globe className="w-5 h-5 mr-2 text-green-500" />
      case 'User Experience':
        return <Users className="w-5 h-5 mr-2 text-green-500" />
      case 'Brand Identity':
        return <Layers className="w-5 h-5 mr-2 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="select-none text-base">
      <div
        className={`flex items-center py-2 px-3 cursor-pointer rounded-md ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-5 h-5 mr-2 text-green-500" />
          ) : (
            <ChevronRight className="w-5 h-5 mr-2 text-green-500" />
          )
        ) : (
          getCategoryIcon(node.category!)
        )}
        {node.url ? (
          <CustomTooltip
            content={
              <div className="w-[238px] h-[159px]">
                <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
              </div>
            }
          >
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors duration-200`}
              onClick={(e) => e.stopPropagation()}
            >
              {node.name}
            </a>
          </CustomTooltip>
        ) : (
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{node.name}</span>
        )}
      </div>
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} isDarkMode={isDarkMode} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Types
type Project = {
  id: string
  name: string
  url: string
  category: 'Graphic Design' | 'Web Design' | 'User Experience' | 'Brand Identity'
  image: string
}

type TreeNode = {
  id: string
  name: string
  children?: TreeNode[]
  url?: string
  category?: 'Graphic Design' | 'Web Design' | 'User Experience' | 'Brand Identity'
  image?: string
}

// Helper functions
const fetchProjects = async (): Promise<Project[]> => {
  return [
    { id: '1', name: 'AiSolves', url: 'https://example.com/aisolves', category: 'Web Design', image: '/placeholder.svg?height=159&width=238' },
    { id: '2', name: 'Techie', url: 'https://example.com/techie', category: 'Web Design', image: '/placeholder.svg?height=159&width=238' },
    { id: '3', name: 'Crypto', url: 'https://example.com/crypto', category: 'Web Design', image: '/placeholder.svg?height=159&width=238' },
    { id: '4', name: 'Elevezine', url: 'https://example.com/elevezine', category: 'Web Design', image: '/placeholder.svg?height=159&width=238' },
    { id: '5', name: 'Brokers Ads', url: 'https://example.com/brokers-ads', category: 'Graphic Design', image: '/placeholder.svg?height=159&width=238' },
    { id: '6', name: 'Music Covers', url: 'https://example.com/music-covers', category: 'Graphic Design', image: '/placeholder.svg?height=159&width=238' },
    { id: '7', name: 'Eagle Brand', url: 'https://example.com/eagle-brand', category: 'Brand Identity', image: '/placeholder.svg?height=159&width=238' },
    { id: '8', name: 'Anime Fest', url: 'https://example.com/anime-fest', category: 'Brand Identity', image: '/placeholder.svg?height=159&width=238' },
  ]
}

const createTreeStructure = (projects: Project[]): TreeNode => {
  const root: TreeNode = { id: 'root', name: 'Portfolio', children: [] }
  const categories: { [key: string]: TreeNode } = {
    'Graphic Design': { id: 'graphic-design', name: 'Graphic Design', children: [] },
    'Web Design': { id: 'web-design', name: 'Web Design', children: [] },
    'User Experience': { id: 'user-experience', name: 'User Experience', children: [] },
    'Brand Identity': { id: 'brand-identity', name: 'Brand Identity', children: [] },
  }

  projects.forEach((project) => {
    const node: TreeNode = {
      id: project.id,
      name: project.name,
      url: project.url,
      category: project.category,
      image: project.image,
    }
    categories[project.category].children!.push(node)
  })

  root.children = Object.values(categories).filter(category => category.children!.length > 0)
  return root
}

// PortfolioTree component
const PortfolioTree: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchProjects()
      const treeStructure = createTreeStructure(projects)
      setTreeData(treeStructure)
    }
    loadProjects()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-[80vw] p-10 rounded-lg shadow-lg overflow-hidden" style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.55) 100%)'
          : 'linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(76,175,80,0.3) 100%)',
        backdropFilter: 'blur(10px)',
      }}>
        <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Portfolio Projects</h2>
        <div className="overflow-auto max-h-[75vh]">
          {treeData ? (
            <TreeNode node={treeData} isDarkMode={isDarkMode} />
          ) : (
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>Loading portfolio...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [text, setText] = useState('')
  const [fullText, setFullText] = useState("Web Designer")
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const containerRef = useRef(null)
  const homeRef = useRef<HTMLDivElement>(null)
  const knowledgeRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.8])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDeleting && index <= fullText.length) {
        setText(fullText.slice(0, index))
        setIndex(prev => prev + 1)
      } else if (isDeleting && index > 0) {
        setText(fullText.slice(0, index))
        setIndex(prev => prev - 1)
      } else {
        setIsDeleting(!isDeleting)
        if (!isDeleting) {
          setFullText(fullText === "Web Designer" ? "Graphic Designer" : "Web Designer")
          setIndex(0)
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [fullText, index, isDeleting])

  const updateActiveSection = () => {
    const homeTop = homeRef.current?.offsetTop ?? 0
    const knowledgeTop = knowledgeRef.current?.offsetTop ?? 0
    const portfolioTop = portfolioRef.current?.offsetTop ?? 0
    const contactTop = contactRef.current?.offsetTop ?? 0

    const scrollPosition = window.scrollY + window.innerHeight / 2

    if (scrollPosition < knowledgeTop) {
      setActiveSection('home')
    } else if (scrollPosition < portfolioTop) {
      setActiveSection('knowledge')
    } else if (scrollPosition < contactTop) {
      setActiveSection('portfolio')
    } else {
      setActiveSection('contact')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.15)
      updateActiveSection()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Set initial active section on mount
    updateActiveSection()
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
      renderer.setSize(300, 300)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom = false
      controls.enablePan = false

      const geometry = new THREE.BufferGeometry()
      const material = new THREE.LineBasicMaterial({ 
        color: isDarkMode ? 0x4CAF50 : 0x2A5E34,
        linewidth: 2,
        opacity: 0.55,
        transparent: true
      })

      const points: THREE.Vector3[] = []
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const turnFraction = 1 - 1 / goldenRatio
      const maxPoints = 500

      for (let i = 0; i < maxPoints; i++) {
        const t = i / maxPoints
        const angle = 2 * Math.PI * turnFraction * i
        const radius = 1.5 * Math.pow(goldenRatio, t / 2)
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        const z = 0.5 * t
        points.push(new THREE.Vector3(x, y, z))
      }

      geometry.setFromPoints(points)
      const spiral = new THREE.Line(geometry, material)
      scene.add(spiral)

      camera.position.z = 5

      const animate = () => {
        requestAnimationFrame(animate)
        spiral.rotation.z += 0.002
        controls.update()
        renderer.render(scene, camera)
      }

      animate()

      return () => {
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [isDarkMode])

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getBentoBoxStyle = () => {
    return {
      background: isDarkMode 
        ? 'linear-gradient(to right, rgba(31, 31, 31, 0.8), rgba(41, 41, 41, 0.8))'
        : 'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(240, 240, 240, 0.8))',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: isDarkMode
        ? '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
        : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
      borderColor: isDarkMode ? '#4CAF50' : undefined,
    }
  }

  return (
    <motion.div 
      className={`font-sans min-h-screen ${isDarkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700'} relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
    >
      {/* Background elements */}
      {isDarkMode ? (
        <div className="fixed inset-0 z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#4CAF50" opacity="0.3" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
      ) : (
        <div className="fixed inset-0 z-10 w-full h-full pointer-events-none">
          <div 
            className="w-full h-full bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
            style={{ 
              opacity: 0.2,
              maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
            }}
          />
        </div>
      )}

      {/* Navigation */}
      <motion.nav 
        className={`fixed left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center p-2 rounded-full ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80' 
            : 'bg-gradient-to-r from-white/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-900/80'
        } backdrop-blur-md shadow-lg transition-all duration-300 ease-out animate-fade-up animate-once animate-delay-150 animate-ease-out animate-alternate`}
        style={{ 
          opacity: 0.95,
          top: scrolled ? '5%' : '15%'
        }}
        animate={{
          top: scrolled ? '5%' : '15%'
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
      >
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${
              activeSection === 'home'
                ? isDarkMode
                  ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                  : 'bg-[#2A5E34]/20 text-[#2A5E34]'
                : isDarkMode
                  ? 'hover:bg-[#4CAF50]/10 text-gray-300 hover:text-[#4CAF50]'
                  : 'hover:bg-[#2A5E34]/10 hover:text-[#2A5E34]'
            } transition-colors duration-300`}
            onClick={() => scrollToSection(homeRef)}
          >
            <Home className="h-5 w-5 mr-2" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${
              activeSection === 'knowledge'
                ? isDarkMode
                  ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                  : 'bg-[#2A5E34]/20 text-[#2A5E34]'
                : isDarkMode
                  ? 'hover:bg-[#4CAF50]/10 text-gray-300 hover:text-[#4CAF50]'
                  : 'hover:bg-[#2A5E34]/10 hover:text-[#2A5E34]'
            } transition-colors duration-300`}
            onClick={() => scrollToSection(knowledgeRef)}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Knowledge
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${
              activeSection === 'portfolio'
                ? isDarkMode
                  ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                  : 'bg-[#2A5E34]/20 text-[#2A5E34]'
                : isDarkMode
                  ? 'hover:bg-[#4CAF50]/10 text-gray-300 hover:text-[#4CAF50]'
                  : 'hover:bg-[#2A5E34]/10 hover:text-[#2A5E34]'
            } transition-colors duration-300`}
            onClick={() => scrollToSection(portfolioRef)}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Portfolio
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${
              activeSection === 'contact'
                ? isDarkMode
                  ? 'bg-[#4CAF50] text-white'
                  : 'bg-[#2A5E34] text-white'
                : isDarkMode
                  ? 'bg-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/30'
                  : 'bg-[#2A5E34]/20 text-[#2A5E34] hover:bg-[#2A5E34]/30'
            } transition-colors duration-300`}
            onClick={() => scrollToSection(contactRef)}
          >
            <Mail className="h-5 w-5 mr-2" />
            Contact
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleTheme}
              className={`rounded-full ${isDarkMode ? 'text-gray-300 hover:text-[#4CAF50]' : 'text-gray-700 hover:text-[#2A5E34]'} transition-colors duration-300`}
            >
              {isDarkMode ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <motion.div 
        className="relative z-20 pt-20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Home section */}
        <MagicUIBlurFade>
          <motion.section 
            ref={homeRef}
            className="relative h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { 
                  staggerChildren: 0.3,
                  delayChildren: 0.2
                }
              }
            }}
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <motion.div 
              className="w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] flex flex-col justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      type: 'spring',
                      stiffness: 100,
                      duration: 1,
                      delay: 0.5
                    }
                  }
                }}
              >
                Hi, I'm <span className={`${isDarkMode ? 'text-[#4CAF50]' : 'text-[#2A5E34]'} animate-fade animate-once animate-delay-500 animate-ease-in`}>
                  Elio
                </span>
              </motion.h1>
              <motion.div
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${isDarkMode ? 'text-[#4CAF50]' : 'text-[#2A5E34]'} text-center overflow-hidden h-[1.2em]`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      type: 'spring',
                      stiffness: 100,
                      duration: 1,
                      delay: 0.7
                    }
                  }
                }}
              >
                <span className="inline-block whitespace-nowrap overflow-hidden">
                  {text}
                </span>
              </motion.div>
              <motion.p 
                className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-10 text-center max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      duration: 1,
                      delay: 0.9
                    }
                  }
                }}
              >
                Creating eye-catching, easy-to-use designs that make your brand stand out.
              </motion.p>
              <motion.div
                className="text-center pb-[5%]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <p className={`${isDarkMode ? 'text-[#4CAF50]' : 'text-[#2A5E34]'} mb-2 animate-bounce animate-infinite animate-delay-150 animate-ease-linear`}>SCROLL</p>
                <ArrowDown className={`w-6 h-6 ${isDarkMode ? 'text-[#4CAF50]' : 'text-[#2A5E34]'} animate-bounce animate-infinite animate-delay-150 animate-ease-linear mx-auto`} />
              </motion.div>
            </motion.div>
          </motion.section>
        </MagicUIBlurFade>

        {/* Knowledge section */}
        <MagicUIBlurFade>
          <motion.section 
            ref={knowledgeRef}
            className="w-full min-h-screen p-6 relative overflow-hidden font-sans"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 relative z-10">
              {/* Intro Section */}
              <motion.div
                className="col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Graphic and Web Designer with nearly 10 years of experience</h2>
                    <p className={`mb-4 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Specialized in crafting innovative and user-centered digital experiences with a focus on Web3 aesthetics and futuristic, visually striking designs.</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <a href="https://www.linkedin.com/in/elio-laurencio/" target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isDarkMode ? "#FFFFFF" : "#000000"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hover:stroke-[#D1C3B1] transition-colors"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </a>
                        <a href="https://dribbble.com/gh0T" target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isDarkMode ? "#FFFFFF" : "#000000"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hover:stroke-[#D1C3B1] transition-colors"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
                          </svg>
                        </a>
                        <a href="https://behance.net/eliolaurencio" target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isDarkMode ? "#FFFFFF" : "#000000"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hover:stroke-[#D1C3B1] transition-colors"
                          >
                            <path d="M22 7h-7v3h7V7z"></path>
                            <path d="M22 11h-7v3h7v-3z"></path>
                            <path d="M4 5C2.9 5 2 5.9 2 7v10c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H4zm7 10H4v-4h7v4z"></path>
                            <path d="M15 5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-5zm7 6h-7V7h7v4z"></path>
                          </svg>
                        </a>
                      </div>
                      <a 
                        href="https://drive.google.com/file/d/10qz9Ph16cM620BuBOeCXkEg4QQqELRVv/view?usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center space-x-2 ${
                          isDarkMode 
                            ? 'bg-white text-black hover:bg-gray-200' 
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        } px-4 py-2 rounded-full text-sm font-bold transition-colors`}
                      >
                        <DownloadIcon className="h-4 w-4" />
                        <span>Resume</span>
                      </a>
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>
              </motion.div>

              {/* Image Section */}
              <motion.div
                className="row-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 rounded-xl shadow-lg relative overflow-hidden h-full`} style={getBentoBoxStyle()}>
                  <div className="relative z-10 h-full flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My name is Elio</h3>
                      <p className={`mb-4 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>But you can call me gh0t!</p>
                      <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Grab my <a href="mailto:eliolaurencio@gmail.com" className={`underline hover:text-[#D1C3B1] transition-colors`}>email</a> and get in touch</p>
                    </div>
                    <div className="w-full h-72 rounded-lg overflow-hidden relative group">
                      <div className="absolute inset-x-[10%] bottom-0 w-[80%] h-10 bg-gradient-to-t from-black to-transparent z-10"></div>
                      <img 
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file-442mUV2YUCv1QocduYoUzBJ5a8QaBZ.png" 
                        alt="Profile of Elio" 
                        className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>
              </motion.div>

              {/* Background Section */}
              <motion.div
                className="col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>A little bit about me</h3>
                    <p className={`mb-4 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>I'm a graphic designer and web developer with over a decade of experience, specializing in creating innovative visual experiences that blend technology and aesthetics. Since I was 13, I've been immersed in the world of design, constantly evolving and adapting to new technologies.</p>
                  </div>
                  <Meteors number={20} />
                </Card>
              </motion.div>

              {/* Experience and Language Section */}
              <motion.div
                className="col-span-2 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Experience Section */}
                <Card className={`p-6 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Experience</h3>
                    <div className="space-y-4">
                      {[
                        { period: "Now", role: "Freelance Web and graphic designer", company: "g.studio", remote: true },
                        { period: "2024", role: "User Experience Designer", company: "AiSolves", remote: true },
                        { period: "2022 — 2023", role: "Senior Graphic Designer", company: "Brokers Ads", remote: "Agency" },
                        { period: "2017-2018", role: "Webmaster", company: "Elevezine", remote: true },
                      ].map((job, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} pr-2`}>{job.role}</p>
                            <p className={`text-xs font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.period}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.company}</p>
                            {job.remote && (
                              <span className={`ml-2 text-xs font-medium ${
                                isDarkMode 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-900/20 text-gray-900'
                              } px-2 py-0.5 rounded-full hover:bg-opacity-30 transition-colors cursor-default`}>
                                ↗ {job.remote === true ? "Remote" : job.remote}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>

                {/* Language Section */}
                <Card className={`p-6 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Languages</h3>
                    <div className="space-y-2">
                      {[
                        { language: "English", level: "B2", description: "Professional writing and speaking" },
                        { language: "Spanish", level: "Native", description: "Native speaking and writing" },
                        { language: "Portuguese", level: "Conversational", description: "Conversational writing and speaking" },
                      ].map((lang, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lang.language}</p>
                            <span className={`text-xs font-medium ${
                              isDarkMode 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-900/20 text-gray-900'
                            } px-2 py-0.5 rounded-full hover:bg-opacity-30 transition-colors cursor-default`}>
                              {lang.level}
                            </span>
                          </div>
                          <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{lang.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>
              </motion.div>

              {/* Tool Stack and 3D Visualization Section */}
              <motion.div
                className="col-span-1 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className={`p-4 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tool stack</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Figma", "Photoshop", "Illustrator",
                        "Vercel", "Firefly", "Tailwind"
                      ].map((tool, index) => (
                        <button
                          key={index}
                          className={`flex items-center justify-center ${
                            isDarkMode 
                              ? 'bg-white/10 hover:bg-white/20' 
                              : 'bg-gray-900/10 hover:bg-gray-900/20'
                          } rounded-lg p-2 transition-colors`}
                        >
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tool}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>
                <Card className={`p-4 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <div className="w-full aspect-square flex items-center justify-center">
                      <canvas
                        ref={canvasRef}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>
              </motion.div>

              {/* Education Section */}
              <motion.div
                className="col-span-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center`}>Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { period: "2023 — 2023", degree: "Prototype figma course", institution: "CoderHouse" },
                        { period: "2022 — 2023", degree: "User Experience", institution: "CoderHouse" },
                        { period: "2017 — 2019", degree: "Multimedia Design", institution: "Fundación Universitas" },
                        { period: "2016 — 2017", degree: "Commercial Advertising Management", institution: "Fundación Universitas" },
                      ].map((education, index) => (
                        <div key={index} className="flex flex-col items-start">
                          <div className="flex justify-between items-start w-full">
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} pr-2`}>{education.degree}</p>
                            <p className={`text-xs font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{education.period}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{education.institution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Meteors number={20} />
                </Card>
              </motion.div>
            </div>
          </motion.section>
        </MagicUIBlurFade>

        {/* Portfolio section */}
        <MagicUIBlurFade>
          <motion.section
            ref={portfolioRef}
            className="min-h-screen w-full flex items-center justify-center p-8"
          >
            <PortfolioTree isDarkMode={isDarkMode} />
          </motion.section>
        </MagicUIBlurFade>

        {/* Contact section */}
        <MagicUIBlurFade>
          <motion.section 
            ref={contactRef}
            className="min-h-screen w-full flex items-center justify-center p-8"
          >
            <Card className={`w-full max-w-md p-6 rounded-xl shadow-lg relative overflow-hidden`} style={getBentoBoxStyle()}>
              <CardHeader>
                <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Name</label>
                    <input type="text" id="name" name="name" className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500`} />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email</label>
                    <input type="email" id="email" name="email" className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500`} />
                  </div>
                  <div>
                    <label htmlFor="message" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Message</label>
                    <textarea id="message" name="message" rows={4} className={`mt-1 block w-full rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500`}></textarea>
                  </div>
                  <Button type="submit" className={`w-full ${isDarkMode ? 'bg-[#4CAF50] hover:bg-[#45a049] text-white' : 'bg-[#2A5E34] hover:bg-[#234c2b] text-white'}`}>
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.section>
        </MagicUIBlurFade>
      </motion.div>

      {/* Global styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          overflow-x: hidden;
        }
        .animate-fade-up {
          animation: fadeUp 0.5s ease-out;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-500px);
            opacity: 0;
          }
        }
        .animate-meteor-effect {
          animation: meteor 5s linear infinite;
        }
      `}</style>
    </motion.div>
  )
}