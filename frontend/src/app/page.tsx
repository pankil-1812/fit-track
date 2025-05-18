"use client"

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Float,
  Sparkles,
  useScroll,
  Center,
  Html,
} from '@react-three/drei'
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dumbbell, ChevronDown, ArrowUpRight, Activity, Trophy, Users, LineChart } from 'lucide-react'

// Dynamic 3D model loader with fallback to simple shapes
function FitnessModel({ scroll }) {
  const group = useRef()

  // Create a more interactive fitness dashboard/tracker visualization
  const createFitnessTracker = () => {
    return (
      <group ref={group} position={[0, 0, 0]} scale={0.75}>
        {/* Main circular progress ring */}
        <group position={[0, 0, 0]}>
          {/* Outer track ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[3, 0.15, 16, 100]} />
            <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
          </mesh>

          {/* Progress fill - animated in useFrame */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[3, 0.25, 16, 100, Math.PI * 1.7]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} emissive="#3b82f6" emissiveIntensity={0.2} />
          </mesh>

          {/* Center hub with pulse effect */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.2} emissive="#3b82f6" emissiveIntensity={0.2} />
          </mesh>

          {/* Activity metrics floating around the ring */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2
            const radius = 3
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius

            return (
              <group key={i} position={[x, 0, z]}>
                {/* Metric pods */}
                <mesh castShadow>
                  <boxGeometry args={[0.8, 0.4, 0.1]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
                </mesh>

                {/* Indicator light */}
                <mesh position={[0, 0, 0.1]} castShadow>
                  <circleGeometry args={[0.1, 32]} />
                  <meshStandardMaterial
                    color={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i]}
                    emissive={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i]}
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            )
          })}

          {/* Activity icons floating in 3D space */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i / 4) * Math.PI * 2
            const radius = 4.5
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius

            // Different fitness-related geometries
            const geometries = [
              <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />, // dumbbell bar
              <torusGeometry args={[0.4, 0.1, 16, 32]} />, // activity ring
              <boxGeometry args={[0.5, 0.5, 0.5]} />, // workout block
              <icosahedronGeometry args={[0.4, 0]} /> // heart rate
            ]

            return (
              <group key={i} position={[x, (i % 2) * 0.5 - 0.25, z]}>
                <mesh castShadow>
                  {geometries[i]}
                  <meshStandardMaterial
                    color={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i]}
                    metalness={0.5}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            )
          })}
        </group>
      </group>
    )
  }

  // Animation based on scroll position and time
  useFrame((state) => {
    if (!group.current) return

    const time = state.clock.getElapsedTime()

    // Rotation animation
    group.current.rotation.y = time * 0.15

    // Make it slightly tilt based on time
    group.current.rotation.x = Math.sin(time * 0.3) * 0.1
    group.current.rotation.z = Math.cos(time * 0.2) * 0.05

    // Position animation based on scroll
    const scrollFactor = scroll?.current || 0
    group.current.position.y = -scrollFactor * 5

    // Scale effect on scroll
    const scale = 0.65 - scrollFactor * 0.2
    group.current.scale.set(scale, scale, scale)

    // Animate child elements
    if (group.current.children[0]) {
      // Pulse effect for the center sphere
      const centerHub = group.current.children[0].children[2]
      if (centerHub) {
        centerHub.scale.x = 1 + Math.sin(time * 2) * 0.05
        centerHub.scale.y = 1 + Math.sin(time * 2) * 0.05
        centerHub.scale.z = 1 + Math.sin(time * 2) * 0.05
      }

      // Rotate the indicator pods slightly
      const pods = group.current.children[0].children.slice(3, 8)
      pods.forEach((pod, i) => {
        if (pod) {
          pod.rotation.z = Math.sin(time * 1 + i) * 0.2
          pod.position.y = Math.sin(time * 0.5 + i * 0.5) * 0.2
        }
      })

      // Move the activity icons
      const activityIcons = group.current.children[0].children.slice(8, 12)
      activityIcons.forEach((icon, i) => {
        if (icon) {
          icon.rotation.x = time * (0.2 + i * 0.1)
          icon.rotation.y = time * (0.1 + i * 0.1)
          icon.position.y = Math.sin(time * 0.5 + i) * 0.3
        }
      })
    }
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
    >
      {createFitnessTracker()}

      {/* Ambient particles/sparkles for premium effect */}
      <Sparkles
        count={100}
        scale={10}
        size={0.4}
        speed={0.3}
        opacity={0.5}
        color="#3b82f6"
      />
    </Float>
  )
}

// Animated stats counter
function AnimatedCounter({ value, label, icon, delay = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // ms
    const interval = 50
    const steps = duration / interval
    const increment = value / steps

    let current = 0
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        current += increment
        setCount(Math.min(Math.floor(current), value))

        if (current >= value) {
          clearInterval(counter)
        }
      }, interval)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-background/50 backdrop-blur-lg rounded-2xl border border-primary/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      viewport={{ once: true }}
    >
      <div className="bg-primary/10 p-4 rounded-xl mb-3">
        {icon}
      </div>
      <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        {count.toLocaleString()}+
      </h3>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  )
}

// 3D Scene
function FitnessDashboard3D({ scrollRef }) {
  const data = useScroll()

  return (
    <div className="h-[500px] md:h-[600px] w-full">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <FitnessModel scroll={data} />
          <Environment preset="city" />
        </Suspense>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />

        {/* Animated floating text */}
        <Float position={[0, -3.5, 0]} speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <Center>
            <Html position={[0, 0, 0]} transform>
              <div className="flex flex-col items-center text-center pointer-events-none">
                <motion.div
                  className="text-primary font-bold text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [10, 0] }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Swipe Up To Explore
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronDown className="h-6 w-6 text-primary mt-18" />
                </motion.div>
              </div>
            </Html>
          </Center>
        </Float>
      </Canvas>
    </div>
  )
}

// Feature card with hover effects
function FeatureCard({ title, description, icon, index }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-background/80 p-8 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

      <div className="relative z-10 space-y-4">
        <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center text-primary font-medium text-sm group-hover:underline">
            Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Testimonial card with premium design
function TestimonialCard({ quote, name, title, avatar, index }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-background/80 p-8 border border-primary/10 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative">
        <div className="text-4xl text-primary/30 mb-4">"</div>
        <p className="text-lg italic text-foreground/80 relative z-10 mb-6">
          {quote}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main component
export default function Home() {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useFramerScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  // Features data
  const features = [
    {
      title: "AI Workout Planning",
      description: "Personalized routines that adapt to your progress and goals with advanced machine learning.",
      icon: <Activity className="h-6 w-6" />
    },
    {
      title: "3D Form Analysis",
      description: "Real-time feedback on your exercise form with detailed visual guidance for maximum results.",
      icon: <Dumbbell className="h-6 w-6" />
    },
    {
      title: "Social Challenges",
      description: "Compete with friends and join community fitness challenges to stay motivated.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive insights into your progress with beautiful visual representations.",
      icon: <LineChart className="h-6 w-6" />
    },
    {
      title: "Achievement System",
      description: "Unlock badges and rewards as you reach milestones and maintain consistency.",
      icon: <Trophy className="h-6 w-6" />
    },
    {
      title: "Nutrition Integration",
      description: "Smart meal planning that syncs perfectly with your workout routine and goals.",
      icon: <Activity className="h-6 w-6" />
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      quote: "This app has completely transformed how I approach fitness. The 3D demonstrations and AI coaching feel like having a personal trainer with me at all times.",
      name: "Alex Johnson",
      title: "CrossFit Enthusiast"
    },
    {
      quote: "As a personal trainer, I recommend FitTrack Pro to all my clients. The analytics help me track their progress remotely and adjust their programs accordingly.",
      name: "Sarah Miller",
      title: "Certified Personal Trainer"
    },
    {
      quote: "The community features keep me accountable. I've made amazing fitness friends and we push each other to new heights through the challenges.",
      name: "Michael Chen",
      title: "Marathon Runner"
    },
  ]

  return (
    <div className="flex flex-col items-center bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <motion.section
        className="w-full py-12 md:py-16 lg:py-18 relative overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>New AI Features Released</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Elevate Your <br />Fitness Journey
              </h1>

              <p className="text-muted-foreground text-xl max-w-[600px] leading-relaxed">
                Experience the next generation of fitness tracking with AI-powered insights, 3D visualizations, and a community that pushes you to excel.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300" asChild>
                  <Link href="/register">
                    Get Started Free
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:bg-primary/5" asChild>
                  <Link href="/about">See How It Works</Link>
                </Button>
              </div>

              {/* Trusted by section */}
              <div className="pt-10">
                <p className="text-sm text-muted-foreground mb-4">TRUSTED BY FITNESS ENTHUSIASTS WORLDWIDE</p>
                <div className="flex items-center gap-8">
                  <motion.div
                    className="h-8 text-muted-foreground/60 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    GymShark
                  </motion.div>
                  <motion.div
                    className="h-8 text-muted-foreground/60 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Under Armour
                  </motion.div>
                  <motion.div
                    className="h-8 text-muted-foreground/60 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    Nike Training
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl opacity-30"></div>
              <FitnessDashboard3D scrollRef={scrollRef} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <AnimatedCounter
              value={250000}
              label="Active Users"
              icon={<Users className="h-6 w-6 text-primary" />}
              delay={0}
            />
            <AnimatedCounter
              value={15000000}
              label="Workouts Completed"
              icon={<Dumbbell className="h-6 w-6 text-primary" />}
              delay={200}
            />
            <AnimatedCounter
              value={85}
              label="Countries"
              icon={<Activity className="h-6 w-6 text-primary" />}
              delay={400}
            />
            <AnimatedCounter
              value={95}
              label="Satisfaction Rate"
              icon={<Trophy className="h-6 w-6 text-primary" />}
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-background/80 to-background relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-20">
            <motion.div
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span>Premium Features</span>
            </motion.div>

            <motion.div
              className="space-y-2 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Designed for Your Fitness Excellence
              </h2>
              <p className="max-w-[700px] text-muted-foreground text-lg">
                Every feature is meticulously crafted to enhance your workout experience and deliver exceptional results.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="w-full py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span>Interactive Experience</span>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold tracking-tighter md:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Visualize Your Progress in <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Real-Time</span>
              </motion.h2>

              <motion.p
                className="text-muted-foreground text-lg max-w-[500px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Our interactive dashboard provides an immersive experience that helps you understand your fitness journey through stunning visualizations.
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {[
                  "3D exercise demonstrations with proper form guidance",
                  "Progress tracking with animated data visualizations",
                  "Personalized workout recommendations based on your goals",
                  "Community challenges and real-time leaderboards"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button className="mt-6 rounded-full px-8 bg-gradient-to-r from-primary to-blue-600">
                  Explore Dashboard
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative overflow-hidden rounded-3xl border border-primary/10 shadow-xl bg-background/50 backdrop-blur-sm">
                <div className="bg-slate-900 h-8 w-full flex items-center px-4 gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="mx-auto text-xs text-slate-400">Fitness Dashboard</div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-lg bg-slate-800 p-4 flex flex-col">
                      <div className="text-xs text-slate-400 mb-1">Today's Progress</div>
                      <div className="text-xl font-bold text-white">78%</div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-4 flex flex-col">
                      <div className="text-xs text-slate-400 mb-1">Calories Burned</div>
                      <div className="text-xl font-bold text-white">527 kcal</div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-800 p-5 mb-4">
                    <div className="text-sm font-medium text-white mb-3">Weekly Performance</div>
                    <div className="flex items-end h-32 gap-2">
                      {[40, 65, 45, 90, 80, 60, 70].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t-sm ${i === 3 ? 'bg-primary' : 'bg-slate-600'}`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-800 p-5">
                    <div className="text-sm font-medium text-white mb-3">Upcoming Workouts</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">Upper Body Focus</div>
                          <div className="text-xs text-slate-400">Today, 5:30 PM</div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          30 min
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">Core Strength</div>
                          <div className="text-xs text-slate-400">Tomorrow, 6:00 AM</div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-500">
                          20 min
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 md:py-32 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-20">
            <motion.div
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span>Success Stories</span>
            </motion.div>

            <motion.div
              className="space-y-2 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Fitness Enthusiasts</span>
              </h2>
              <p className="max-w-[700px] text-muted-foreground text-lg">
                Join the community of users who have transformed their fitness journey with our platform.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                title={testimonial.title}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 backdrop-blur-3xl opacity-30"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-600 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 p-8 md:p-16">
              <div className="max-w-md space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Start Your Fitness Transformation Today
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  Join thousands of users who are achieving their fitness goals with our comprehensive platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                    <Link href="/register">Start Free Trial</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-white/20 text-white hover:bg-white/10" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>

              <div className="relative lg:right-10 lg:bottom-6">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg opacity-50 blur-lg bg-white"></div>
                  <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10 p-4">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                        <div className="h-10 bg-white/10 rounded-lg"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                        <div className="h-10 bg-white/10 rounded-lg"></div>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                        <div className="h-10 bg-white/10 rounded-lg"></div>
                      </div>
                      <div className="col-span-2">
                        <div className="h-12 bg-white/20 rounded-lg flex items-center justify-center text-sm text-white font-medium">
                          Get Started Now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}