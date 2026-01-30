'use client'

import { useState, useEffect } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function PrivacyPolicyPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: "Can I use KlickShare without facial recognition?",
      answer: "Yes! While facial recognition enhances the experience, you can disable it and still use all other features like manual photo sharing and group management."
    },
    {
      question: "Who can see my photos?",
      answer: "Only people you explicitly share with can see your photos. Our AI helps organize sharing, but you maintain full control over who has access."
    },
    {
      question: "How do I delete my data completely?",
      answer: "Go to Account Settings > Privacy > Delete Account. This will permanently remove all your photos, facial recognition data, and account information within 30 days."
    },
    {
      question: "Is my facial recognition data shared with others?",
      answer: "Never. Facial recognition data is encrypted, stored separately, and used only within our platform to organize your photos. It's never shared with third parties."
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
          max-height: 200px;
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
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
              Your privacy is our priority. Learn how we protect your data and memories.
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
                    <a href="#introduction" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">1. Introduction</a>
                    <a href="#information-collection" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">2. Information We Collect</a>
                    <a href="#facial-recognition" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">3. Facial Recognition</a>
                    <a href="#data-usage" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">4. How We Use Data</a>
                    <a href="#data-sharing" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">5. Data Sharing</a>
                    <a href="#data-retention" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">6. Data Retention</a>
                    <a href="#user-rights" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">7. Your Rights</a>
                    <a href="#security" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">8. Security</a>
                    <a href="#international" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">9. International Transfers</a>
                    <a href="#changes" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">10. Policy Changes</a>
                    <a href="#contact" className="toc-link block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-white">11. Contact Us</a>
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Introduction */}
                <section id="introduction" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">👋</span>
                    <h2 className="text-2xl font-bold text-gray-800">1. Introduction</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Welcome to KlickShare.in ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information and photos. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our intelligent photo sharing platform.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    By using KlickShare.in, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
                  </p>
                </section>

                {/* Information Collection */}
                <section id="information-collection" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📊</span>
                    <h2 className="text-2xl font-bold text-gray-800">2. Information We Collect</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li>• Name and email address when you create an account</li>
                    <li>• Profile information you choose to provide</li>
                    <li>• Contact information for customer support</li>
                    <li>• Payment information for premium features (processed securely by third-party providers)</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Photo and Media Data</h3>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li>• Photos and videos you upload to our platform</li>
                    <li>• Metadata associated with your media files (date, location if enabled)</li>
                    <li>• Facial recognition data derived from your photos</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Information</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• How you interact with our platform and features</li>
                    <li>• Device information (browser type, operating system)</li>
                    <li>• IP address and general location information</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                {/* Facial Recognition */}
                <section id="facial-recognition" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🧠</span>
                    <h2 className="text-2xl font-bold text-gray-800">3. Facial Recognition Technology</h2>
                  </div>
                  
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                    <p className="text-teal-800 font-medium">Important: Facial recognition is core to our service, but you have full control.</p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI analyzes facial features in uploaded photos to automatically organize and share images with the right people. This technology creates mathematical representations (not stored images) of facial features.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Control</h3>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    <li>• You can opt-out of facial recognition at any time</li>
                    <li>• You can request deletion of all facial recognition data</li>
                    <li>• You control which photos are processed</li>
                    <li>• You can review and correct recognition results</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Security</h3>
                  <p className="text-gray-600">
                    Facial recognition data is encrypted, stored separately from photos, and never shared with third parties. It's used solely to enhance your photo sharing experience within our platform.
                  </p>
                </section>

                {/* Data Usage */}
                <section id="data-usage" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🎯</span>
                    <h2 className="text-2xl font-bold text-gray-800">4. How We Use Your Data</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Core Services</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Organize and share your photos intelligently</li>
                        <li>• Provide facial recognition features</li>
                        <li>• Enable group photo sharing</li>
                        <li>• Maintain your account and preferences</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Improvement</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li>• Improve our AI algorithms</li>
                        <li>• Enhance user experience</li>
                        <li>• Provide customer support</li>
                        <li>• Ensure platform security</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-medium">We never use your photos for advertising or sell your data to third parties.</p>
                  </div>
                </section>

                {/* Data Sharing */}
                <section id="data-sharing" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🤝</span>
                    <h2 className="text-2xl font-bold text-gray-800">5. Data Sharing and Disclosure</h2>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">We Share Data Only When:</h3>
                  <ul className="text-gray-600 mb-6 space-y-3">
                    <li>• <strong>You direct us to:</strong> When you share photos with specific users or groups</li>
                    <li>• <strong>Service providers:</strong> With trusted partners who help operate our platform (under strict confidentiality)</li>
                    <li>• <strong>Legal requirements:</strong> When required by law or to protect rights and safety</li>
                    <li>• <strong>Business transfers:</strong> In case of merger or acquisition (with continued privacy protection)</li>
                  </ul>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">We never sell your personal data or photos to advertisers or data brokers.</p>
                  </div>
                </section>

                {/* Data Retention */}
                <section id="data-retention" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">⏰</span>
                    <h2 className="text-2xl font-bold text-gray-800">6. Data Retention</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-800">Photos and Media</p>
                        <p className="text-gray-600">Retained until you delete them or close your account</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-800">Facial Recognition Data</p>
                        <p className="text-gray-600">Deleted within 30 days of photo deletion or account closure</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-800">Account Information</p>
                        <p className="text-gray-600">Retained for up to 90 days after account deletion for recovery purposes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-800">Usage Analytics</p>
                        <p className="text-gray-600">Anonymized data may be retained for service improvement</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* User Rights */}
                <section id="user-rights" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">⚖</span>
                    <h2 className="text-2xl font-bold text-gray-800">7. Your Rights and Controls</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800">Access & Download</h4>
                        <p className="text-gray-600 text-sm">Request a copy of all your data</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Correction</h4>
                        <p className="text-gray-600 text-sm">Update or correct your information</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Deletion</h4>
                        <p className="text-gray-600 text-sm">Delete your account and all associated data</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800">Opt-out</h4>
                        <p className="text-gray-600 text-sm">Disable facial recognition features</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Portability</h4>
                        <p className="text-gray-600 text-sm">Export your photos and data</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Objection</h4>
                        <p className="text-gray-600 text-sm">Object to certain data processing</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                    <p className="text-teal-800">To exercise these rights, contact us at privacy@klickshare.in or use the settings in your account.</p>
                  </div>
                </section>

                {/* Security */}
                <section id="security" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🛡</span>
                    <h2 className="text-2xl font-bold text-gray-800">8. Security Measures</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    We implement industry-standard security measures to protect your data:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">🔐</div>
                      <h4 className="font-semibold text-gray-800 mb-1">Encryption</h4>
                      <p className="text-gray-600 text-sm">End-to-end encryption for all data</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">🏢</div>
                      <h4 className="font-semibold text-gray-800 mb-1">Secure Servers</h4>
                      <p className="text-gray-600 text-sm">Enterprise-grade cloud infrastructure</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">👥</div>
                      <h4 className="font-semibold text-gray-800 mb-1">Access Control</h4>
                      <p className="text-gray-600 text-sm">Strict employee access policies</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-6">
                    While we strive to protect your data, no method of transmission over the internet is 100% secure. We continuously monitor and update our security practices.
                  </p>
                </section>

                {/* International Transfers */}
                <section id="international" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">🌍</span>
                    <h2 className="text-2xl font-bold text-gray-800">9. International Data Transfers</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    KlickShare.in is based in India, and your data is primarily stored on servers located in India. If you access our service from other countries, your data may be transferred to and processed in India.
                  </p>
                  <p className="text-gray-600">
                    We ensure that any international transfers comply with applicable data protection laws and implement appropriate safeguards to protect your privacy rights.
                  </p>
                </section>

                {/* Policy Changes */}
                <section id="changes" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📝</span>
                    <h2 className="text-2xl font-bold text-gray-800">10. Changes to This Policy</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.
                  </p>
                  <p className="text-gray-600">
                    We will notify you of any material changes by email or through a prominent notice on our platform. Your continued use of KlickShare.in after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                {/* Contact */}
                <section id="contact" className="section-card bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📧</span>
                    <h2 className="text-2xl font-bold text-gray-800">11. Contact Us</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Privacy Officer</h4>
                      <p className="text-gray-600">privacy@klickshare.in</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">General Support</h4>
                      <p className="text-gray-600">support@klickshare.in</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Mailing Address</h4>
                      <p className="text-gray-600">
                        KlickShare.in<br />
                        123 Innovation Street<br />
                        Tech Hub, Mumbai 400001<br />
                        India
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Response Time</h4>
                      <p className="text-gray-600">We respond to privacy inquiries within 48 hours</p>
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
        {/* <footer className="bg-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">KlickShare.in</h3>
              <p className="text-gray-400">Where Memories Meet Intelligence</p>
            </div>
            <p className="text-gray-400">© 2024 KlickShare.in. All rights reserved.</p>
          </div>
        </footer> */}
      </div>
    </>
  )
}