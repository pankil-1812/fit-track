"use client"

import { motion } from "framer-motion"
import { ChevronRight, Shield } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-all">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Privacy Policy</span>
        </div>
      </motion.div>

      {/* Policy content */}
      <motion.div
        className="prose dark:prose-invert max-w-none space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
          <p className="text-muted-foreground leading-relaxed">
            Last Updated: May 15, 2025
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            FitTrack Pro ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you use our FitTrack Pro platform (our "Service") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            This policy applies to information we collect:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>Through our website and mobile application.</li>
            <li>In email, text, and other electronic messages between you and our Service.</li>
            <li>Through mobile and desktop applications you download from our Service.</li>
            <li>When you interact with our advertising and applications on third-party websites and services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect several types of information from and about users of our Service, including:
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">2.1 Personal Information</h3>
          <p className="text-muted-foreground leading-relaxed">
            Personal information that you provide directly to us, such as:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>Contact information (name, email address, phone number)</li>
            <li>Account information (username, password)</li>
            <li>Profile information (age, gender, height, weight, profile picture)</li>
            <li>Billing information (payment details, billing address)</li>
            <li>Health and fitness data (workout logs, routines, physical metrics, goals)</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">2.2 Usage Information</h3>
          <p className="text-muted-foreground leading-relaxed">
            Information about your interaction with our Service, such as:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>Activity patterns and usage statistics</li>
            <li>Fitness tracking data</li>
            <li>Log files and device information</li>
            <li>Location data (if enabled)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use information that we collect about you or that you provide to us:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>To provide, maintain, and improve our Service.</li>
            <li>To process and complete transactions, and send you related information.</li>
            <li>To send administrative information, such as updates, security alerts, and support messages.</li>
            <li>To personalize your experience and deliver content relevant to your interests.</li>
            <li>To analyze trends, administer the website, track users' movements around the website, and gather demographic information.</li>
            <li>To comply with our legal obligations and enforce our legal rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may disclose personal information that we collect or you provide:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>To fulfill the purpose for which you provide it.</li>
            <li>To service providers, contractors, and other third parties we use to support our business.</li>
            <li>To comply with any court order, law, or legal process.</li>
            <li>To enforce our Terms of Service and other agreements.</li>
            <li>With your consent or at your direction.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Choices</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can access and update certain information about you from within your account settings. You can also opt-out of receiving promotional emails by following the unsubscribe instructions in those emails. You may also send requests about your data to our contact information below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please understand that no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Our Privacy Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update our Privacy Policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on our website or mobile app. The date the privacy policy was last revised is identified at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions or comments about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 p-6 bg-muted/30 rounded-xl border border-primary/10">
            <p className="font-medium">FitTrack Pro</p>
            <p className="text-muted-foreground">123 Fitness Street, Health District</p>
            <p className="text-muted-foreground">San Francisco, CA 94103</p>
            <p className="text-muted-foreground mt-2">Email: privacy@fittrackpro.com</p>
            <p className="text-muted-foreground">Phone: +1 (202) 555-0187</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
