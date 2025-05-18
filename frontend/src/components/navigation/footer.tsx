'use client'
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Dumbbell,
    ChevronRight,
    Mail,
    MapPin,
    Phone,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle newsletter subscription
        alert(`Thank you for subscribing with ${email}! You'll receive our fitness updates soon.`)
        setEmail("")
    }

    // Current year for copyright
    const currentYear = new Date().getFullYear()

    // Footer links organized by section - only include available pages
    const footerLinks = [
        {
            title: "Features",
            links: [
                { name: "Workout Routines", href: "/routines" },
                { name: "Progress Tracking", href: "/workout-logs" },
                { name: "Performance Analytics", href: "/analytics" },
                { name: "Fitness Challenges", href: "/challenges" },
            ]
        },
        {
            title: "Community",
            links: [
                { name: "Activity Feed", href: "/social" },
                { name: "Find Friends", href: "/social" },
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Help Center", href: "/help" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookies Policy", href: "/cookies" },
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" }
            ]
        },
    ]

    // Social media links
    const socialLinks = [
        { name: "Instagram", href: "https://instagram.com", icon: <Instagram className="h-5 w-5" /> },
        { name: "Twitter", href: "https://twitter.com", icon: <Twitter className="h-5 w-5" /> },
        { name: "Facebook", href: "https://facebook.com", icon: <Facebook className="h-5 w-5" /> },
        { name: "YouTube", href: "https://youtube.com", icon: <Youtube className="h-5 w-5" /> },
    ]

    return (
        <footer className="relative bg-gradient-to-b from-background to-background/95 pt-16 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-50" />
                <div className="absolute bottom-40 right-20 h-60 w-60 rounded-full bg-blue-500/5 blur-3xl opacity-50" />
            </div>

            {/* Main footer content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12">
                    {/* Logo and company info */}
                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-sm opacity-70"></div>
                                <div className="relative bg-background rounded-full p-2">
                                    <Dumbbell className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <span className="font-bold text-xl">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                    FitTrack
                                </span>
                                <span> Pro</span>
                            </span>
                        </Link>

                        <p className="text-muted-foreground mb-6 max-w-md">
                            Your personalized journey to fitness excellence. Track workouts, optimize routines, and achieve your goals with our comprehensive platform.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <span className="text-sm text-muted-foreground">
                                    123 Fitness Street, Health District<br />
                                    San Francisco, CA 94103
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <a href="mailto:contact@fittrackpro.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    contact@fittrackpro.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <a href="tel:+12025550187" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    +1 (202) 555-0187
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="lg:col-span-1 xl:col-span-2">
                            <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary group flex items-center transition-colors"
                                        >
                                            <ChevronRight className="h-3 w-3 mr-1 text-primary/40 group-hover:text-primary transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter subscription */}
                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
                        <h3 className="font-semibold mb-4 text-lg">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for the latest fitness tips, features, and exclusive offers.
                        </p>

                        <form onSubmit={handleSubmit} className="mb-8">
                            <div className="relative max-w-md">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-4 pr-12 py-3 rounded-full bg-muted/50 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-1 top-1 rounded-full bg-gradient-to-r from-primary to-blue-600 h-8 w-8 p-0 flex items-center justify-center"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>

                        {/* App badges */}
                        <div className="space-y-3">
                            <h3 className="font-semibold mb-2 text-lg">Get The App</h3>
                            <div className="flex flex-wrap gap-2">
                                {/* App Store badge */}
                                <div className="h-10 p-2 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-md flex items-center text-white text-xs cursor-pointer">
                                    <div className="m-2">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/1724px-Apple_logo_grey.svg.png" alt="App Store" className="h-8" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] opacity-75">Download on the</div>
                                        <div className="font-medium">App Store</div>
                                    </div>
                                </div>

                                {/* Google Play badge */}
                                <div className="h-10 px-5 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-md flex items-center text-white text-xs cursor-pointer">
                                    <div className="mr-2">
                                        <img src="https://static.vecteezy.com/system/resources/previews/017/395/379/non_2x/google-play-store-mobile-apps-logo-free-png.png" alt="Google Play" className="h-8" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] opacity-75">GET IT ON</div>
                                        <div className="font-medium">Google Play</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer bottom - social links and copyright */}
                <div className="border-t border-primary/10 mt-16 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {link.icon}
                                </motion.a>
                            ))}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            © {currentYear} FitTrack Pro. All rights reserved.
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                Terms
                            </Link>
                            <Link href="/cookies" className="hover:text-primary transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative wave pattern at bottom */}
            <div className="w-full h-8 mt-4 relative z-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 opacity-30"></div>
        </footer>
    )
}