'use client'

import { useState, useEffect } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function TermsAndConditionsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: "What happens if I violate the terms?",
      answer: "Depending on the severity, we may issue warnings, temporarily suspend features, or terminate your account. We always try to work with users to resolve issues when possible."
    },
    {
      question: "Can I use KlickShare for commercial purposes?",
      answer: "Personal accounts are for personal use only. For commercial use, please contact us about our business plans which include additional features and different terms."
    },
    {
      question: "Who owns the photos I upload?",
      answer: "You retain full ownership of your photos. By uploading, you grant us limited rights to store, process, and display them as part of our service, but ownership always remains with you."
    },
    {
      question: "Can I delete my account anytime?",
      answer: "Yes, you can delete your account at any time from your settings. This will permanently remove all your data within 30 days, though some information may be retained for legal compliance."
    },
    {
      question: "What if someone uploads my photo without permission?",
      answer: "Contact us immediately with details. We take unauthorized uploads seriously and will investigate promptly. We have procedures to remove content and take action against violating accounts."
    }
  ]

  useEffect(() => {
    // Smooth scrolling for table of contents
    const handleTOCClick = (e: Event) => {
      e.preventDefault()
      const target = e.target as HTMLAnchorElement
      const targetId = target.getAttribute('href')?.substring(1)
      if (targetId) {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    const tocLinks = document.querySelectorAll('.toc-link')
    tocLinks.forEach(link => {
      link.addEventListener('click', handleTOCClick)
    })

    return () => {
      tocLinks.forEach(link => {
        link.removeEventListener('click', handleTOCClick)
      })
    }
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        .gradient-bg {
          background: linear-gradient(135deg, #1f6563 0%, #0f4f4c 100%);
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .section-card {
          transition: all 0.3s ease;
        }
        
        .section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(31, 101, 99, 0.1);
        }
        
        .toc-link {
          transition: all 0.3s ease;
        }
        
        .toc-link:hover {
          background: linear-gradient(45deg, #1f6563, #0f4f4c);
          color: white;
          transform: translateX(5px);
        }
        
        .faq-item {
          transition: all 0.3s ease;
        }
        
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .faq-content.open {
          max-height: 300px;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="bg-gray-50">
        {/* Header */}
        <header className="gradient-bg text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="floating-animation inline-block mb-6">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
              Clear guidelines for using KlickShare safely and responsibly.
            </p>
            <p className="text-sm mt-4 text-teal-200">Last updated: October 2025</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    <a href="#acceptance" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">1. Acceptance of Terms</a>
                    <a href="#eligibility" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">2. Eligibility</a>
                    <a href="#account" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">3. Account Registration</a>
                    <a href="#service-description" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">4. Service Description</a>
                    <a href="#user-responsibilities" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">5. User Responsibilities</a>
                    <a href="#prohibited-activities" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">6. Prohibited Activities</a>
                    <a href="#content-ownership" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">7. Content & Ownership</a>
                    <a href="#privacy-data" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">8. Privacy & Data</a>
                    <a href="#service-availability" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">9. Service Availability</a>
                    <a href="#payments" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">10. Payments & Subscriptions</a>
                    <a href="#intellectual-property" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">11. Intellectual Property</a>
                    <a href="#disclaimers" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">12. Disclaimers</a>
                    <a href="#limitation-liability" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">13. Limitation of Liability</a>
                    <a href="#termination" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">14. Termination</a>
                    <a href="#governing-law" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">15. Governing Law</a>
                    <a href="#changes" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">16. Changes to Terms</a>
                    <a href="#contact" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">17. Contact Information</a>
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Acceptance of Terms */}
                <section id="acceptance" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">✅</span>
                    <h2 className="text-2xl font-bold text-gray-800">1. Acceptance of Terms</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Welcome to KlickShare.in ("we," "our," "us," or "KlickShare"). These Terms and Conditions ("Terms") govern your use of our intelligent photo sharing platform and services.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    By accessing or using KlickShare.in, creating an account, or uploading content, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our service.
                  </p>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-teal-800 font-medium">Important: These Terms constitute a legally binding agreement between you and KlickShare.in.</p>
                  </div>
                </section>

                {/* Eligibility */}
                <section id="eligibility" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">👤</span>
                    <h2 className="text-2xl font-bold text-gray-800">2. Eligibility</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Age Requirements</h3>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li>• You must be at least 13 years old to use KlickShare</li>
                    <li>• Users under 18 must have parental consent</li>
                    <li>• We may require age verification for certain features</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal Capacity</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• You must have the legal capacity to enter into agreements</li>
                    <li>• You represent that all information provided is accurate</li>
                    <li>• You are not prohibited from using our services under applicable law</li>
                  </ul>
                </section>

                {/* Account Registration */}
                <section id="account" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🔐</span>
                    <h2 className="text-2xl font-bold text-gray-800">3. Account Registration</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Creation</h3>
                  <p className="text-gray-600 mb-4">
                    To access certain features, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Security</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• Choose a strong, unique password</li>
                    <li>• Do not share your login credentials with others</li>
                    <li>• Notify us immediately of any unauthorized access</li>
                    <li>• You are responsible for all activities under your account</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">One account per person. Multiple accounts may result in suspension.</p>
                  </div>
                </section>

                {/* Service Description */}
                <section id="service-description" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🚀</span>
                    <h2 className="text-2xl font-bold text-gray-800">4. Service Description</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    KlickShare is an intelligent photo sharing platform that uses AI technology, including facial recognition, to help you organize and share photos with friends and family.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Core Features</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <ul className="text-gray-600 space-y-2">
                      <li>• AI-powered photo organization</li>
                      <li>• Facial recognition technology</li>
                      <li>• Intelligent photo sharing</li>
                      <li>• Group photo management</li>
                    </ul>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Privacy-focused sharing controls</li>
                      <li>• Cloud storage and backup</li>
                      <li>• Mobile and web access</li>
                      <li>• Premium features and plans</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Evolution</h3>
                  <p className="text-gray-600">
                    We continuously improve our service by adding new features, updating existing ones, or removing features that are no longer viable. We'll notify users of significant changes.
                  </p>
                </section>

                {/* User Responsibilities */}
                <section id="user-responsibilities" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">⚡</span>
                    <h2 className="text-2xl font-bold text-gray-800">5. User Responsibilities</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Responsibility</h3>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li>• Only upload content you own or have permission to share</li>
                    <li>• Ensure all people in photos have consented to sharing</li>
                    <li>• Respect others' privacy and intellectual property rights</li>
                    <li>• Do not upload inappropriate, illegal, or harmful content</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Usage</h3>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li>• Use the service only for its intended purpose</li>
                    <li>• Do not attempt to circumvent security measures</li>
                    <li>• Report violations and inappropriate content</li>
                    <li>• Keep your contact information up to date</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal Compliance</h3>
                  <p className="text-gray-600">
                    You must comply with all applicable local, national, and international laws and regulations when using KlickShare. This includes but is not limited to privacy laws, copyright laws, and data protection regulations.
                  </p>
                </section>

                {/* Prohibited Activities */}
                <section id="prohibited-activities" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🚫</span>
                    <h2 className="text-2xl font-bold text-gray-800">6. Prohibited Activities</h2>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 font-medium">The following activities are strictly prohibited and may result in account termination:</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Violations</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Uploading illegal, harmful, or offensive content</li>
                        <li>• Sharing copyrighted material without permission</li>
                        <li>• Posting content that violates others' privacy</li>
                        <li>• Distributing malware or malicious code</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Abuse</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Attempting to hack or compromise security</li>
                        <li>• Creating fake accounts or impersonating others</li>
                        <li>• Spamming or sending unsolicited communications</li>
                        <li>• Interfering with other users' experience</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-medium">We reserve the right to investigate violations and take appropriate action, including account suspension or termination.</p>
                  </div>
                </section>

                {/* Content & Ownership */}
                <section id="content-ownership" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📸</span>
                    <h2 className="text-2xl font-bold text-gray-800">7. Content & Ownership</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Content Ownership</h3>
                  <p className="text-gray-600 mb-4">
                    You retain full ownership of all photos, videos, and other content you upload to KlickShare. We do not claim ownership of your content.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">License to KlickShare</h3>
                  <p className="text-gray-600 mb-4">
                    By uploading content, you grant KlickShare a limited, non-exclusive, royalty-free license to:
                  </p>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li>• Store and process your content to provide our services</li>
                    <li>• Display your content to users you choose to share with</li>
                    <li>• Use facial recognition technology to organize your photos</li>
                    <li>• Create backups and ensure service reliability</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Removal</h3>
                  <p className="text-gray-600">
                    You can delete your content at any time. We may also remove content that violates these Terms or applicable laws. Upon account deletion, we will delete your content within 30 days, except where retention is required by law.
                  </p>
                </section>

                {/* Privacy & Data */}
                <section id="privacy-data" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🔒</span>
                    <h2 className="text-2xl font-bold text-gray-800">8. Privacy & Data</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Facial Recognition</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• Facial recognition is used to organize and share photos intelligently</li>
                    <li>• You can opt-out of facial recognition at any time</li>
                    <li>• Facial data is encrypted and stored securely</li>
                    <li>• We never share facial recognition data with third parties</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Security</h3>
                  <p className="text-gray-600">
                    We implement industry-standard security measures to protect your data. However, no system is completely secure, and you acknowledge the inherent risks of internet-based services.
                  </p>
                </section>

                {/* Service Availability */}
                <section id="service-availability" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🌐</span>
                    <h2 className="text-2xl font-bold text-gray-800">9. Service Availability</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Uptime</h3>
                  <p className="text-gray-600 mb-4">
                    We strive to maintain high service availability but cannot guarantee uninterrupted access. Services may be temporarily unavailable due to maintenance, updates, or technical issues.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Modifications</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• We may modify, suspend, or discontinue features at any time</li>
                    <li>• We'll provide reasonable notice for significant changes</li>
                    <li>• Some changes may be implemented immediately for security reasons</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Geographic Restrictions</h3>
                  <p className="text-gray-600">
                    KlickShare may not be available in all countries or regions. We reserve the right to restrict access based on geographic location or local laws.
                  </p>
                </section>

                {/* Payments & Subscriptions */}
                <section id="payments" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">💳</span>
                    <h2 className="text-2xl font-bold text-gray-800">10. Payments & Subscriptions</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Premium Features</h3>
                  <p className="text-gray-600 mb-4">
                    KlickShare offers both free and premium features. Premium subscriptions provide additional storage, advanced features, and enhanced functionality.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Billing Terms</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• Subscriptions are billed in advance on a recurring basis</li>
                    <li>• Prices are subject to change with 30 days notice</li>
                    <li>• All fees are non-refundable except as required by law</li>
                    <li>• Failed payments may result in service suspension</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Cancellation</h3>
                  <p className="text-gray-600">
                    You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. You'll retain access to premium features until then.
                  </p>
                </section>

                {/* Intellectual Property */}
                <section id="intellectual-property" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">⚖</span>
                    <h2 className="text-2xl font-bold text-gray-800">11. Intellectual Property</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">KlickShare's Rights</h3>
                  <p className="text-gray-600 mb-4">
                    KlickShare, our logo, and all related trademarks, service marks, and trade names are owned by us. The platform's software, algorithms, and user interface are protected by copyright and other intellectual property laws.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Respect for Others' Rights</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• Do not upload content that infringes others' copyrights</li>
                    <li>• Respect trademark and patent rights</li>
                    <li>• Report suspected intellectual property violations</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">DMCA Compliance</h3>
                  <p className="text-gray-600">
                    We respond to valid DMCA takedown notices. If you believe your copyrighted work has been infringed, please contact our designated agent with the required information.
                  </p>
                </section>

                {/* Disclaimers */}
                <section id="disclaimers" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">⚠</span>
                    <h2 className="text-2xl font-bold text-gray-800">12. Disclaimers</h2>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 font-medium">KlickShare is provided "as is" without warranties of any kind.</p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Disclaimers</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• We do not guarantee error-free or uninterrupted service</li>
                    <li>• Facial recognition accuracy may vary</li>
                    <li>• We are not responsible for user-generated content</li>
                    <li>• Third-party integrations are provided as-is</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Technology Limitations</h3>
                  <p className="text-gray-600">
                    Our AI and facial recognition technology, while advanced, may not always be 100% accurate. Users should review and verify AI-generated suggestions and groupings.
                  </p>
                </section>

                {/* Limitation of Liability */}
                <section id="limitation-liability" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🛡</span>
                    <h2 className="text-2xl font-bold text-gray-800">13. Limitation of Liability</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    To the maximum extent permitted by law, KlickShare shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Liability Cap</h3>
                  <p className="text-gray-600 mb-4">
                    Our total liability to you for all claims arising from your use of KlickShare shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Indemnification</h3>
                  <p className="text-gray-600">
                    You agree to indemnify and hold KlickShare harmless from any claims, damages, or expenses arising from your use of the service, violation of these Terms, or infringement of others' rights.
                  </p>
                </section>

                {/* Termination */}
                <section id="termination" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🔚</span>
                    <h2 className="text-2xl font-bold text-gray-800">14. Termination</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Termination by You</h3>
                  <p className="text-gray-600 mb-4">
                    You may terminate your account at any time by following the account deletion process in your settings. This will permanently delete your account and associated data.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Termination by KlickShare</h3>
                  <p className="text-gray-600 mb-4">
                    We may suspend or terminate your account if you violate these Terms, engage in prohibited activities, or for other legitimate business reasons. We'll provide notice when possible.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Effect of Termination</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Your right to use KlickShare immediately ceases</li>
                    <li>• Your content will be deleted within 30 days</li>
                    <li>• Some provisions of these Terms survive termination</li>
                    <li>• Outstanding payments remain due</li>
                  </ul>
                </section>

                {/* Governing Law */}
                <section id="governing-law" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🏛</span>
                    <h2 className="text-2xl font-bold text-gray-800">15. Governing Law</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    These Terms are governed by the laws of India, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Mumbai, India.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Dispute Resolution</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• We encourage resolving disputes through direct communication</li>
                    <li>• Mediation may be pursued before litigation</li>
                    <li>• Class action lawsuits are waived where legally permissible</li>
                    <li>• Some disputes may be subject to arbitration</li>
                  </ul>
                </section>

                {/* Changes to Terms */}
                <section id="changes" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📝</span>
                    <h2 className="text-2xl font-bold text-gray-800">16. Changes to Terms</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    We may update these Terms from time to time to reflect changes in our service, legal requirements, or business practices.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Notification Process</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• Material changes will be communicated via email or platform notice</li>
                    <li>• We'll provide at least 30 days notice for significant changes</li>
                    <li>• Continued use after changes constitutes acceptance</li>
                    <li>• You may terminate your account if you disagree with changes</li>
                  </ul>

                  <p className="text-gray-600">
                    We recommend reviewing these Terms periodically to stay informed of any updates.
                  </p>
                </section>

                {/* Contact Information */}
                <section id="contact" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📧</span>
                    <h2 className="text-2xl font-bold text-gray-800">17. Contact Information</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    If you have questions about these Terms or need to report violations, please contact us:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Legal Department</h4>
                      <p className="text-gray-600">legal@klickshare.in</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">General Support</h4>
                      <p className="text-gray-600">support@klickshare.in</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Mailing Address</h4>
                      <p className="text-gray-600">
                        KlickShare.in<br />
                        Legal Department<br />
                        123 Innovation Street<br />
                        Tech Hub, Mumbai 400001<br />
                        India
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday<br />
                        9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">❓</span>
                    <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <div key={index} className="faq-item border border-gray-200 rounded-lg">
                        <button 
                          className="w-full text-left p-4 font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center"
                          onClick={() => toggleFAQ(index)}
                        >
                          <span>{item.question}</span>
                          <span className="text-xl">{openFAQ === index ? '−' : '+'}</span>
                        </button>
                        <div className={`faq-content px-4 pb-4 ${openFAQ === index ? 'open' : ''}`}>
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">KlickShare.in</h3>
              <p className="text-gray-400">Where Memories Meet Intelligence</p>
            </div>
            <p className="text-gray-400">© 2025 KlickShare.in. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}