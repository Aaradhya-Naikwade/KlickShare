'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        .gradient-bg {
          background: linear-gradient(135deg, #1f6563 0%, #0f4f4c 100%);
        }
        
        .contact-card {
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(31, 101, 99, 0.3); }
          50% { box-shadow: 0 0 40px rgba(31, 101, 99, 0.6); }
        }
        
        .form-input {
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(31, 101, 99, 0.15);
        }
        
        .success-animation {
          animation: successPulse 0.6s ease-out;
        }
        
        @keyframes successPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="gradient-bg text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="floating-animation inline-block mb-6">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">📧</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-16">
          {/* Contact Info Cards */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="contact-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">📍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  123 Innovation Street<br />
                  Tech Hub, Mumbai 400001<br />
                  India
                </p>
              </div>

              <div className="contact-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">📞</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600">
                  +91 98765 43210<br />
                  +91 87654 32109<br />
                  Mon-Fri 9AM-6PM IST
                </p>
              </div>

              <div className="contact-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">✉</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600">
                  hello@klickshare.in<br />
                  support@klickshare.in<br />
                  We reply within 24 hours
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="md:flex">
                {/* Form Section */}
                <div className="md:w-2/3 p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Send us a Message</h2>
                  <p className="text-gray-600 mb-8">
                    Have questions about KlickShare? We're here to help you get started with intelligent photo sharing.
                  </p>

                  {isSubmitted && (
                    <div className="success-animation bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <div>
                          <h4 className="text-green-800 font-semibold">Message Sent Successfully!</h4>
                          <p className="text-green-600 text-sm">We'll get back to you within 24 hours.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                          errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none ${
                          errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Tell us more about your inquiry..."
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 pulse-glow'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>

                {/* Info Section */}
                <div className="md:w-1/3 bg-gradient-to-br from-teal-600 to-teal-700 p-8 md:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">🚀</span>
                      <div>
                        <h4 className="font-semibold mb-1">Quick Response</h4>
                        <p className="text-teal-100 text-sm">We typically respond to all inquiries within 24 hours.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h4 className="font-semibold mb-1">Expert Support</h4>
                        <p className="text-teal-100 text-sm">Our team of experts is ready to help with any questions.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <h4 className="font-semibold mb-1">Privacy First</h4>
                        <p className="text-teal-100 text-sm">Your information is secure and never shared with third parties.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">🌟</span>
                      <div>
                        <h4 className="font-semibold mb-1">Premium Experience</h4>
                        <p className="text-teal-100 text-sm">Join thousands of users who trust KlickShare for their memories.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-teal-400">
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                      <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <span className="text-lg">📘</span>
                      </button>
                      <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <span className="text-lg">🐦</span>
                      </button>
                      <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <span className="text-lg">📷</span>
                      </button>
                      <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <span className="text-lg">💼</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Quick answers to common questions</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "How does KlickShare's facial recognition work?",
                  answer: "Our AI-powered facial recognition automatically identifies people in photos and sorts them into personalized galleries, ensuring everyone gets their photos without manual tagging."
                },
                {
                  question: "Is my data secure with KlickShare?",
                  answer: "Absolutely! We use enterprise-grade encryption and follow strict privacy protocols. Your photos are stored securely and only shared with people you choose."
                },
                {
                  question: "Can I use KlickShare for commercial events?",
                  answer: "Yes! KlickShare is perfect for weddings, corporate events, parties, and any gathering where you want to share photos intelligently with attendees."
                },
                {
                  question: "What file formats do you support?",
                  answer: "We support all major image formats including JPEG, PNG, HEIC, and RAW files. Photos are automatically optimized while maintaining quality."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
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