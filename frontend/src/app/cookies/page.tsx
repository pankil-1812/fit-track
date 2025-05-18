"use client"

import { motion } from "framer-motion"
import { ChevronRight, Cookie } from "lucide-react"
import Link from "next/link"

export default function CookiesPolicy() {
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
              <Cookie className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookies Policy</h1>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-all">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Cookies Policy</span>
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
            FitTrack Pro ("we," "our," or "us") uses cookies and similar technologies on our website and mobile application. This Cookies Policy explains how we use cookies, how they work, and your choices regarding cookies.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            By using our website or mobile application, you consent to our use of cookies as described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. Cookies help websites recognize your device and remember information about your visit, such as your preferences, settings, and how you use the website.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Cookies are not the only technologies we use to collect information. We may also use web beacons, pixels, local storage, and other similar technologies. For simplicity, we refer to all of these technologies as "cookies" in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the following types of cookies:
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">3.1 Essential Cookies</h3>
          <p className="text-muted-foreground leading-relaxed">
            These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas of the website, and remembering your preferences. These cookies do not collect information about you that could be used for marketing purposes or remembering where you've been on the internet.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">3.2 Performance and Analytics Cookies</h3>
          <p className="text-muted-foreground leading-relaxed">
            These cookies collect information about how visitors use our website, such as which pages visitors go to most often, and if they get error messages from web pages. These cookies don't collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. We use these cookies to improve how our website works.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">3.3 Functionality Cookies</h3>
          <p className="text-muted-foreground leading-relaxed">
            These cookies allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. They may also be used to provide services you have asked for, such as watching a video or commenting on a blog.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">3.4 Targeting and Advertising Cookies</h3>
          <p className="text-muted-foreground leading-relaxed">
            These cookies are used to deliver content that is more relevant to you and your interests. They may be used to deliver targeted advertising or to limit the number of times you see an advertisement. They also help us measure the effectiveness of advertising campaigns. We may share this information with other organizations, such as advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Some cookies are placed by third parties on our website. These third parties may include analytics providers, advertising networks, and social media platforms. These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website and other websites.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We do not control these third parties or their use of cookies. Please refer to the privacy policies of these third parties for more information about how they use cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. How Long Do Cookies Stay on Your Device?</h2>
          <p className="text-muted-foreground leading-relaxed">
            The length of time a cookie will remain on your device depends on whether it is a "persistent" or "session" cookie. Session cookies will remain on your device until you stop browsing. Persistent cookies remain on your device until they expire or are deleted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Managing Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, delete cookies, or to alert you when cookies are being sent. However, if you disable or refuse cookies, please note that some parts of the website may not function properly.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            The methods for managing cookies vary depending on your browser:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>Google Chrome: Settings → Privacy and security → Cookies and other site data</li>
            <li>Mozilla Firefox: Options → Privacy & Security → Cookies and Site Data</li>
            <li>Safari: Preferences → Privacy</li>
            <li>Microsoft Edge: Settings → Cookies and site permissions → Cookies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Your Consent</h2>
          <p className="text-muted-foreground leading-relaxed">
            By using our website and mobile application, you consent to our use of cookies as described in this Cookies Policy. If you do not wish to accept cookies from us, you can instruct your browser to refuse cookies from our website or disable the cookies through our cookie consent tool when you first visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Cookie Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update our Cookies Policy from time to time. Any changes we make to our Cookies Policy in the future will be posted on this page and, where appropriate, notified to you when you next visit our website. Please check back frequently to see any updates or changes to our Cookies Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions or concerns about our Cookies Policy, please contact us at:
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
