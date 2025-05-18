"use client"

import { motion } from "framer-motion"
import { ChevronRight, FileText } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-all">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Terms of Service</span>
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
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the FitTrack Pro service, website, and mobile application (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            These Terms constitute a legally binding agreement between you and FitTrack Pro regarding your use of the Service. Please read them carefully.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may modify these Terms at any time. We will provide notice of any changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after any such change constitutes your acceptance of the new Terms. If you do not agree to any of these Terms or any future Terms, do not use or access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Privacy Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Please refer to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for information on how we collect, use, and disclose information about our users. By using the Service, you consent to the collection and use of information in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
          <h3 className="text-xl font-medium mt-6 mb-3">4.1 Account Creation</h3>
          <p className="text-muted-foreground leading-relaxed">
            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">4.2 Account Responsibilities</h3>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>Maintaining the confidentiality of your account password.</li>
            <li>Restricting access to your account.</li>
            <li>All activities that occur under your account.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You must notify us immediately of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Subscription and Billing</h2>
          <h3 className="text-xl font-medium mt-6 mb-3">5.1 Free Trial</h3>
          <p className="text-muted-foreground leading-relaxed">
            We may offer a free trial of our premium services. At the end of the free trial period, you will be automatically charged the applicable subscription fee unless you cancel before the trial expires.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">5.2 Subscription Fees</h3>
          <p className="text-muted-foreground leading-relaxed">
            By subscribing to our premium services, you agree to pay the subscription fees indicated at the time of purchase. Subscription fees are charged at the beginning of your subscription and on each renewal date.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">5.3 Cancellation</h3>
          <p className="text-muted-foreground leading-relaxed">
            You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of the current billing period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. User Content</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Service may allow you to post, link, store, share, and otherwise make available certain information, text, graphics, or other material ("User Content"). You are solely responsible for the User Content that you post, and you agree not to post any content that:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
            <li>Infringes any third party's intellectual property or proprietary rights.</li>
            <li>Is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable.</li>
            <li>Promotes discrimination, bigotry, racism, hatred against any individual or group.</li>
            <li>Promotes illegal activities.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Health Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            The content provided through our Service is for informational and educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, in no event shall FitTrack Pro, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, including but not limited to direct, indirect, special, incidental, consequential, or punitive damages, arising out of or related to your use or inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions or concerns about these Terms, please contact us at:
          </p>
          <div className="mt-4 p-6 bg-muted/30 rounded-xl border border-primary/10">
            <p className="font-medium">FitTrack Pro</p>
            <p className="text-muted-foreground">123 Fitness Street, Health District</p>
            <p className="text-muted-foreground">San Francisco, CA 94103</p>
            <p className="text-muted-foreground mt-2">Email: legal@fittrackpro.com</p>
            <p className="text-muted-foreground">Phone: +1 (202) 555-0187</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
