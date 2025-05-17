"use client"

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Model({ rotation = [0, 0, 0], position = [0, 0, 0], scale = 2.5 }) {
  // Use a placeholder 3D model until we have a proper fitness model
  const mesh = useRef()
  
  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.15
  })

  return (
    <Float
      speed={1.75}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh ref={mesh} position={position} scale={scale}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#3b82f6"
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>
    </Float>
  )
}

function FitnessDashboard3D() {
  return (
    <div className="h-[300px] md:h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Transform Your Fitness Journey
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Track your workouts, optimize your routines, and achieve your fitness goals with our comprehensive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <FitnessDashboard3D />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Features Designed for Your Fitness Success
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to elevate your workout experience and track your progress efficiently.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Smart Workout Tracking",
                description: "Log your exercises, sets, and reps with an intuitive interface that adapts to your routine."
              },
              {
                title: "Visual Analytics",
                description: "Monitor your progress with beautiful charts and insights that help you understand your performance."
              },
              {
                title: "Customizable Routines",
                description: "Create and modify workout routines that fit your goals and schedule perfectly."
              },
              {
                title: "Community Challenges",
                description: "Join fitness challenges and compete with friends to stay motivated and engaged."
              },
              {
                title: "Stretch Sequences",
                description: "Access guided stretching routines to improve flexibility and prevent injuries."
              },
              {
                title: "Progress Sharing",
                description: "Share your achievements on social media and inspire others in your fitness community."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="relative overflow-hidden rounded-lg border bg-background p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Trusted by Fitness Enthusiasts
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                See what our users have to say about their transformation journey with our app.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
            {[
              {
                quote: "This app has completely revolutionized my workout routine. The analytics are incredibly helpful!",
                name: "Alex Johnson",
                title: "CrossFit Athlete"
              },
              {
                quote: "I've tried many fitness apps, but this one stands out with its intuitive design and comprehensive tracking.",
                name: "Sarah Miller",
                title: "Personal Trainer"
              },
              {
                quote: "The community features keep me motivated. I love competing in challenges with friends!",
                name: "Michael Chen",
                title: "Fitness Enthusiast"
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="rounded-lg border bg-background p-6 shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="space-y-4">
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Fitness Journey?
              </h2>
              <p className="max-w-[700px] md:text-xl opacity-90">
                Join thousands of users who are achieving their fitness goals with our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Sign Up Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
