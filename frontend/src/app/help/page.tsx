"use client"

import { motion } from "framer-motion"
import { ChevronRight, Puzzle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="container px-4 py-16 md:py-24 max-w-4xl mx-auto">
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
              <Puzzle className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Center</h1>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-all">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Help Center</span>
        </div>
      </motion.div>

      {/* Help Center content */}
      <motion.div
        className="prose dark:prose-invert max-w-none space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
          <h2 className="text-xl font-semibold mb-2">How can we help you?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Find answers to commonly asked questions and learn how to make the most of FitTrack Pro.
          </p>
        </div>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">How do I create a workout routine?</h3>
              <p className="text-muted-foreground">
                To create a new routine, navigate to the Routines section from the main menu, then click on "Create Routine." 
                From there, you can add exercises, set reps, weights, and rest times, and organize your workout days.
              </p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">How do I track my progress?</h3>
              <p className="text-muted-foreground">
                Your progress is automatically tracked as you log workouts. Visit the Analytics section to view detailed charts 
                and statistics about your performance, including strength gains, workout frequency, and more.
              </p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">Can I connect with friends on the platform?</h3>
              <p className="text-muted-foreground">
                Yes! Visit the Community section and use the "Find Friends" feature. You can search by name or email, 
                send friend requests, and share your achievements with your connections.
              </p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">How do I join a challenge?</h3>
              <p className="text-muted-foreground">
                Go to the Challenges section and browse available challenges. Click on any challenge that interests you 
                and select "Join Challenge." You can track your progress directly within the challenge dashboard.
              </p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">Can I use the app offline?</h3>
              <p className="text-muted-foreground">
                Yes, FitTrack Pro has offline capabilities. You can log workouts without an internet connection, and 
                they will sync with our servers once you're back online.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              New to FitTrack Pro? Follow these steps to get started:
            </p>
            
            <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
              <li>
                <span className="font-medium">Complete your profile:</span> Add your fitness details, goals, and a profile picture to personalize your experience.
              </li>
              <li>
                <span className="font-medium">Take the fitness assessment:</span> This helps us customize recommendations based on your current fitness level.
              </li>
              <li>
                <span className="font-medium">Explore routines:</span> Browse our library of pre-made routines or create your own custom workout plan.
              </li>
              <li>
                <span className="font-medium">Log your first workout:</span> Use the workout logger to record exercises, sets, reps, and weights.
              </li>
              <li>
                <span className="font-medium">Connect with the community:</span> Join challenges, find friends, and engage with the fitness community.
              </li>
            </ol>
          </div>
        </section>

        {/* Contact Support Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">Contact Support</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available to help you with any questions or issues.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center text-primary hover:underline"
              >
                Get in Touch
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="text-lg font-medium mb-2">Video Tutorials</h3>
              <p className="text-muted-foreground mb-4">
                Watch step-by-step guides on how to use all features of FitTrack Pro.
              </p>
              <Link 
                href="#" 
                className="inline-flex items-center text-primary hover:underline"
              >
                Watch Videos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
