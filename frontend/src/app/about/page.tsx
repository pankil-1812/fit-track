"use client"

import { motion } from "framer-motion"
import { ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container px-4 py-16 md:py-24 mx-auto">
      {/* Header with animation */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-blue-500 blur-md opacity-70"></div>
            <div className="relative bg-background rounded-full p-3">
              <Info className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About FitTrack Pro</h1>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-all">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>About Us</span>
        </div>
      </motion.div>

      {/* About content */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Mission Section */}
          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              At FitTrack Pro, our mission is to make fitness accessible, measurable, and enjoyable for everyone. 
              We believe that with the right tools, guidance, and community support, anyone can achieve their fitness goals 
              and lead a healthier life.
            </p>
          </section>

          {/* Vision & Values */}
          <section className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="bg-muted/30 p-8 rounded-2xl border border-primary/10">
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To create a world where fitness is personalized, data-driven, and integrated into everyday life. 
                We envision a future where everyone has access to personalized fitness guidance that adapts to 
                their unique needs, goals, and progress.
              </p>
            </div>
            <div className="bg-muted/30 p-8 rounded-2xl border border-primary/10">
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• <span className="font-medium">Innovation</span> - Constantly improving our platform</li>
                <li>• <span className="font-medium">Inclusivity</span> - Fitness for everyone, regardless of level</li>
                <li>• <span className="font-medium">Privacy</span> - Protecting your personal data</li>
                <li>• <span className="font-medium">Community</span> - Building supportive connections</li>
                <li>• <span className="font-medium">Evidence-based</span> - Science-backed approaches</li>
              </ul>
            </div>
          </section>

          {/* Our Story */}
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                FitTrack Pro was founded in 2023 by a team of fitness enthusiasts, data scientists, and healthcare professionals 
                who shared a common frustration: existing fitness apps weren't providing the comprehensive, personalized 
                experience people needed to succeed in their fitness journeys.
              </p>
              <p>
                What began as a simple workout tracking tool has evolved into a comprehensive fitness ecosystem that leverages 
                the power of data analytics, personalization, and community support. Today, FitTrack Pro serves millions of 
                users worldwide, helping them track progress, optimize routines, and achieve their fitness goals.
              </p>
              <p>
                Our team has grown, but our mission remains the same: to empower individuals with the tools and insights they 
                need to transform their fitness journey.
              </p>
            </div>
          </section>

          {/* Team Section */}
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">JD</span>
                </div>
                <h3 className="font-bold text-lg">Jane Doe</h3>
                <p className="text-muted-foreground text-sm">CEO & Co-Founder</p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">JS</span>
                </div>
                <h3 className="font-bold text-lg">John Smith</h3>
                <p className="text-muted-foreground text-sm">CTO & Co-Founder</p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">AP</span>
                </div>
                <h3 className="font-bold text-lg">Alex Parker</h3>
                <p className="text-muted-foreground text-sm">Chief Product Officer</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Ready to transform your fitness journey with personalized tracking, actionable insights, and a supportive community?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="rounded-full px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:shadow-md hover:shadow-primary/20"
                  asChild
                >
                  <Link href="/register">Get Started for Free</Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
