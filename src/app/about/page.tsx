'use client'

import { useEffect } from 'react'
import { useRouter } from "next/navigation";


export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    // Add intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          target.style.opacity = '1'
          target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    // Observe feature cards for staggered animation
    document.querySelectorAll('.feature-card').forEach((card, index) => {
      const element = card as HTMLElement
      element.style.opacity = '0'
      element.style.transform = 'translateY(30px)'
      element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleGetStarted = () => {
    alert('Welcome to KlickShare.in! Sign-up functionality would be implemented here.')
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        .gradient-bg {
          background: linear-gradient(135deg, #1f6563 0%, #0f4f4c 100%);
        }
        
        .feature-card {
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
        
        .mission-card {
          transition: all 0.4s ease;
        }
        
        .mission-card:hover {
          transform: scale(1.02);
          box-shadow: 0 25px 50px rgba(31, 101, 99, 0.15);
        }
        
        .stats-counter {
          animation: countUp 2s ease-out;
        }
        
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bg-gray-50">
        {/* Header */}
        <header className="gradient-bg text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-white rounded-full"></div>
          </div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="floating-animation inline-block mb-6">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">📸</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About KlickShare.in</h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              Where Memories Meet Intelligence
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-16">
          {/* Welcome Section */}
          <section className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Welcome to the Future of Photo Sharing</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              At KlickShare.in, we believe that memories deserve more than just storage — they deserve intelligent sharing.
              We are a next-generation photo sharing platform designed to simplify how moments are captured, organized,
              and shared, using the power of facial recognition and smart group-based distribution.
            </p>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "10K+", label: "Happy Users" },
                { number: "1M+", label: "Photos Shared" },
                { number: "99.9%", label: "Accuracy Rate" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div key={index} className="stats-counter text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="mission-card bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl text-white">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-center">
                  To revolutionize photo sharing by making it intelligent, effortless, and privacy-focused.
                  We empower people to capture and share life's precious moments without the hassle of
                  manual organization or privacy concerns.
                </p>
              </div>

              <div className="mission-card bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl text-white">🔮</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-center">
                  To become the world's most trusted platform for intelligent photo sharing, where every
                  memory finds its perfect audience automatically, and privacy is never compromised for convenience.
                </p>
              </div>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What We Do</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                KlickShare.in brings together photographers, event organizers, and everyday users on one intuitive platform
                that ensures every photo finds its way to the right person — automatically.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Highest Quality Photos</h3>
                <p className="text-gray-600">Photos are always maintained at the highest quality, preserving every detail of your precious memories.</p>
              </div>

              <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Recognition</h3>
                <p className="text-gray-600">Facial recognition intelligently sorts and shares images, making organization effortless.</p>
              </div>

              <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Seamless Group Sharing</h3>
                <p className="text-gray-600">From small families to large events, group sharing is smooth and intuitive.</p>
              </div>

              <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy Respected</h3>
                <p className="text-gray-600">Users see only the photos they're meant to see, ensuring complete privacy control.</p>
              </div>

              <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">🧑‍💼</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Admin Control</h3>
                <p className="text-gray-600">Admins have full control over visibility and access permissions.</p>
              </div>

              <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Processing</h3>
                <p className="text-gray-600">Photos are processed and distributed instantly using advanced AI technology.</p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600">Simple steps to intelligent photo sharing</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  {
                    number: 1,
                    title: "Upload Your Photos",
                    description: "Whether you're a photographer or user, easily upload your photos to the platform."
                  },
                  {
                    number: 2,
                    title: "Create Groups",
                    description: "Set up groups for weddings, trips, school events, family reunions, and more."
                  },
                  {
                    number: 3,
                    title: "AI Recognition",
                    description: "Our facial recognition engine automatically identifies people in photos."
                  },
                  {
                    number: 4,
                    title: "Smart Distribution",
                    description: "Photos are instantly sorted and shown only to the people who appear in them."
                  },
                  {
                    number: 5,
                    title: "Flexible Access",
                    description: "Photographers can grant access for members to view all photos, making sharing flexible."
                  }
                ].map((step) => (
                  <div key={step.number} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why KlickShare Section */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-3xl p-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose KlickShare?</h2>
              </div>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Unlike traditional photo-sharing tools, KlickShare.in doesn't just dump your photos into a feed.
                  We help you intelligently distribute memories, ensuring each user gets a personalized photo experience
                  without compromising quality or privacy.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whether you're managing hundreds of photos from a major event or sharing a handful with friends,
                  KlickShare makes it effortless, secure, and smart.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🔒",
                  title: "Privacy First",
                  description: "Your memories are yours. We never compromise on privacy or data security."
                },
                {
                  icon: "🎯",
                  title: "User-Centric",
                  description: "Every feature is designed with our users' needs and experiences in mind."
                },
                {
                  icon: "🚀",
                  title: "Innovation",
                  description: "We continuously push boundaries to make photo sharing smarter and easier."
                },
                {
                  icon: "🤝",
                  title: "Trust",
                  description: "Building lasting relationships through transparency and reliable service."
                }
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Join the Future of Photo Sharing</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                KlickShare.in isn't just another photo platform — it's the evolution of digital memory sharing.
                Sign up today and experience a smarter way to capture, connect, and cherish moments.
              </p>
              <button
                onClick={() => router.push("/signup")}

                className="pulse-glow bg-gradient-to-r from-teal-600 to-teal-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
              </button>
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