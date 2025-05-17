import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid grid-cols-2 gap-8 py-8 md:grid-cols-4 lg:grid-cols-5">
        <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-xl">FitTrack Pro</span>
          </Link>
          <p className="text-sm text-muted-foreground mb-4">
            Your personalized journey to fitness excellence
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Features</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/routines" className="text-muted-foreground hover:text-foreground transition-colors">
                Workout Routines
              </Link>
            </li>
            <li>
              <Link href="/workout-logs" className="text-muted-foreground hover:text-foreground transition-colors">
                Progress Tracking
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                Performance Analytics
              </Link>
            </li>
            <li>
              <Link href="/challenges" className="text-muted-foreground hover:text-foreground transition-colors">
                Fitness Challenges
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Community</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/social" className="text-muted-foreground hover:text-foreground transition-colors">
                Community Feed
              </Link>
            </li>
            <li>
              <Link href="/challenges" className="text-muted-foreground hover:text-foreground transition-colors">
                Group Challenges
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Fitness Blog
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <h3 className="font-semibold mb-3">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for the latest fitness tips and updates.
          </p>
          <form className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FitTrack Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
