"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Menu, X, Sun, Moon, User, LogIn,
    Dumbbell, Calendar, BarChart2, Award, Activity, LogOut,
    Bell, ChevronDown, Settings
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const pathname = usePathname()
    const { setTheme, theme } = useTheme()

    // Authentication state management
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" })

    // Handle scroll event to add background blur on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Check if user is authenticated on component mount
    useEffect(() => {
        // In a real app, this would check localStorage or a token
        const token = localStorage.getItem("authToken")
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    // Main navigation items
    const navItems = [
        {
            name: "Routines",
            href: "/routines",
            icon: <Dumbbell className="h-5 w-5" />,
            submenu: [
                { name: "Discover", href: "/routines/discover" },
                { name: "My Routines", href: "/routines/my-routines" },
                { name: "Create New", href: "/routines/create" },
            ]
        },
        {
            name: "Workouts",
            href: "/workout-logs",
            icon: <Calendar className="h-5 w-5" />,
            submenu: [
                { name: "Start Workout", href: "/workout-logs/start" },
                { name: "History", href: "/workout-logs/history" },
                { name: "Templates", href: "/workout-logs/templates" },
            ]
        },
        {
            name: "Analytics",
            href: "/analytics",
            icon: <BarChart2 className="h-5 w-5" />,
            submenu: [
                { name: "Dashboard", href: "/analytics/dashboard" },
                { name: "Progress", href: "/analytics/progress" },
                { name: "Reports", href: "/analytics/reports" },
            ]
        },
        {
            name: "Challenges",
            href: "/challenges",
            icon: <Award className="h-5 w-5" />,
            submenu: [
                { name: "Active Challenges", href: "/challenges/active" },
                { name: "Discover", href: "/challenges/discover" },
                { name: "Create Challenge", href: "/challenges/create" },
            ]
        },
        {
            name: "Community",
            href: "/social",
            icon: <Activity className="h-5 w-5" />,
            submenu: [
                { name: "Feed", href: "/social/feed" },
                { name: "Friends", href: "/social/friends" },
                { name: "Groups", href: "/social/groups" },
            ]
        },
    ]

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    // Handle dropdown show/hide
    const handleDropdownHover = (item) => {
        setActiveDropdown(item)
    }

    const handleDropdownLeave = () => {
        setActiveDropdown(null)
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-sm"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                            <div className="relative bg-background rounded-full p-2">
                                <Dumbbell className="h-6 w-6 text-primary group-hover:text-blue-500 transition-colors duration-300" />
                            </div>
                        </div>
                        <motion.span
                            className="hidden font-bold sm:inline-block text-xl"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                FitTrack
                            </span>
                            <span> Pro</span>
                        </motion.span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-1">
                    {navItems.map((item) => (
                        <div
                            key={item.href}
                            className="relative"
                            onMouseEnter={() => handleDropdownHover(item.name)}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:bg-primary/10 ${pathname === item.href || pathname.startsWith(item.href + '/')
                                        ? "text-primary"
                                        : "text-foreground"
                                    }`}
                            >
                                {item.name}
                                {item.submenu && (
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            {item.submenu && activeDropdown === item.name && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50 min-w-[200px]">
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="rounded-xl bg-background/80 backdrop-blur-xl shadow-lg border border-primary/10 p-2 overflow-hidden"
                                    >
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className="flex items-center gap-2 w-full text-sm px-3 py-2 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {/* Notification Button */}
                    {isAuthenticated && (
                        <div className="relative">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                            </Button>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full transition-all duration-200 hover:bg-primary/10"
                            >
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl bg-background/80 backdrop-blur-xl border border-primary/10">
                            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                                <Sun className="h-4 w-4 mr-2" />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                                <Moon className="h-4 w-4 mr-2" />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                                <Settings className="h-4 w-4 mr-2" />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu or Auth Buttons */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-full flex items-center gap-2 pl-2 pr-3 transition-all duration-200 hover:bg-primary/10"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-blue-500 blur-sm opacity-70"></div>
                                        <div className="relative h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <span className="font-medium text-sm">John D.</span>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl bg-background/80 backdrop-blur-xl border border-primary/10"
                            >
                                <div className="flex items-center gap-2 p-2">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">John Doe</div>
                                        <div className="text-xs text-muted-foreground">john@example.com</div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="h-4 w-4 mr-2" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-destructive">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            <Button
                                variant="ghost"
                                className="rounded-full pl-4 pr-4 transition-all duration-200 hover:bg-primary/10"
                                asChild
                            >
                                <Link href="/login">
                                    Login
                                </Link>
                            </Button>
                            <Button
                                className="rounded-full px-6 bg-gradient-to-r from-primary to-blue-600 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 border-0"
                                asChild
                            >
                                <Link href="/register">
                                    Start Free
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-full transition-all duration-200 hover:bg-primary/10"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4 pb-32 shadow-lg md:hidden bg-background/80 backdrop-blur-xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative z-20 grid gap-6 rounded-2xl bg-background/50 p-6 shadow-sm border border-primary/10">
                            <nav className="grid grid-flow-row auto-rows-max text-sm gap-2">
                                {navItems.map((item) => (
                                    <div key={item.name} className="space-y-1">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center justify-between gap-2 p-3 rounded-xl ${pathname === item.href
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-primary/5 text-foreground"
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1">
                                                    {item.icon}
                                                </div>
                                                {item.name}
                                            </div>
                                            {item.submenu && <ChevronDown className="h-4 w-4 opacity-50" />}
                                        </Link>

                                        {/* Mobile Submenu */}
                                        {item.submenu && (
                                            <div className="ml-8 border-l border-primary/10 pl-4 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href}
                                                        className="flex items-center p-2 rounded-lg hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {!isAuthenticated && (
                                    <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-primary/10">
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-xl"
                                            asChild
                                        >
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <LogIn className="h-4 w-4 mr-2" />
                                                Login
                                            </Link>
                                        </Button>
                                        <Button
                                            className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600"
                                            asChild
                                        >
                                            <Link
                                                href="/register"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Sign Up
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}