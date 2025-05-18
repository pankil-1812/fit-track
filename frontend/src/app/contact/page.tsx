"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Mail, MapPin, Phone, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage({
        type: "success",
        text: "Thank you for your message! We'll get back to you soon."
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null)
      }, 5000)
    }, 1500)
  }

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
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-all">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Contact</span>
        </div>
      </motion.div>

      {/* Contact content */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-5 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Contact Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions, feedback, or need assistance? We're here to help! 
              Reach out to our team using the contact form or through any of the methods below.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Location</h3>
                  <p className="text-muted-foreground">123 Fitness Street, Health District<br />San Francisco, CA 94103</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <a href="mailto:contact@fittrackpro.com" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@fittrackpro.com
                  </a><br />
                  <a href="mailto:support@fittrackpro.com" className="text-muted-foreground hover:text-primary transition-colors">
                    support@fittrackpro.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <a href="tel:+12025550187" className="text-muted-foreground hover:text-primary transition-colors">
                    +1 (202) 555-0187
                  </a><br />
                  <a href="tel:+12025550188" className="text-muted-foreground hover:text-primary transition-colors">
                    +1 (202) 555-0188
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-primary/10">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                Saturday: 10:00 AM - 4:00 PM (PST)<br />
                Sunday: Closed
              </p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-muted/30 p-8 rounded-xl border border-primary/10">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {submitMessage ? (
                <div className={`p-4 mb-6 rounded-lg ${submitMessage.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                  {submitMessage.text}
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="rounded-full w-full sm:w-auto px-8 py-6 bg-gradient-to-r from-primary to-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
        
        {/* Map */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Our Location</h2>
          <div className="w-full h-80 rounded-xl overflow-hidden border border-primary/10">
            {/* Placeholder for map - in a real app, you'd use a Google Maps or other map component */}
            <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground">
              Interactive Map Would Be Displayed Here
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
