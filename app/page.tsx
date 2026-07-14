"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Waves, AlertTriangle, Users, BarChart3, Globe, Menu, X, BookOpen } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleLearnMore = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    } else {
      alert(
        "Learn more about VARUNA:\\n\\n• Real-time ocean hazard monitoring\\n• AI-powered threat detection\\n• Citizen reporting system\\n• Emergency response coordination\\n• Social media analysis\\n• Official INCOIS integration",
      )
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-ocean-foam)] rounded-full blur-xl wave-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[var(--color-accent)] rounded-full blur-lg float-animation"></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-[var(--color-ocean-light)] rounded-full blur-2xl wave-animation"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-[var(--color-coral-accent)] rounded-full blur-xl float-animation"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center pulse-glow">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VARUNA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/report" className="text-white/80 hover:text-white transition-colors">
              Reports
            </Link>
            <Link href="/social" className="text-white/80 hover:text-white transition-colors">
              Social Media
            </Link>
            <Link href="/analytics" className="text-white/80 hover:text-white transition-colors">
              Analytics
            </Link>
            <button onClick={handleLearnMore} className="text-white/80 hover:text-white transition-colors">
              About
            </button>
            <Link href="/auth/login">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-ocean-deep)]/95 backdrop-blur-lg border-t border-white/10">
            <div className="p-6 space-y-4">
              <Link href="/report" className="block text-white/80 hover:text-white transition-colors">
                Reports
              </Link>
              <Link href="/social" className="block text-white/80 hover:text-white transition-colors">
                Social Media
              </Link>
              <Link href="/analytics" className="block text-white/80 hover:text-white transition-colors">
                Analytics
              </Link>
              <button
                onClick={handleLearnMore}
                className="block text-white/80 hover:text-white transition-colors text-left"
              >
                About
              </button>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/30">
            Powered by INCOIS & AI Technology
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Real-time Ocean
            <span className="block text-[var(--color-accent)] wave-animation">Hazard Monitoring</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
            Protecting India's coastline through citizen reporting, AI analysis, and official insights. Monitor storms,
            tsunamis, and marine hazards in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-8 py-4 text-lg"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore Live Map
              </Button>
            </Link>
            <Link href="/report">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Report Hazard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Comprehensive Ocean Safety</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Advanced monitoring system combining citizen reports, social media analysis, and official data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Citizen Reporting"
              description="Enable coastal communities to report hazards instantly with GPS tagging and media uploads"
              delay="0s"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="AI Analytics"
              description="Machine learning analyzes social media and images to detect and classify ocean hazards automatically"
              delay="0.2s"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Real-time Monitoring"
              description="Live dashboard with interactive maps, severity indicators, and emergency response coordination"
              delay="0.4s"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">7,500+</div>
                <div className="text-white/70">Km Coastline</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">12</div>
                <div className="text-white/70">Coastal States</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">24/7</div>
                <div className="text-white/70">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">Real-time</div>
                <div className="text-white/70">Alerts</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join India's Ocean Safety Network</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the solution. Report hazards, access real-time data, and help protect our coastal communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-[var(--color-coral-accent)] hover:bg-[var(--color-coral-accent)]/90 text-white px-8 py-4"
              >
                Get Started Today
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 bg-transparent"
              onClick={handleLearnMore}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 px-6 py-20 bg-[var(--color-ocean-deep)]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About VARUNA</h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              A comprehensive ocean hazard monitoring system designed specifically for India's vast coastline, combining
              cutting-edge technology with community participation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                <p className="text-white/70 leading-relaxed">
                  To protect India's 7,500+ km coastline and coastal communities through real-time monitoring, early
                  warning systems, and coordinated emergency response.
                </p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Technology Stack</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• AI-powered hazard detection and classification</li>
                  <li>• Real-time social media sentiment analysis</li>
                  <li>• GPS-enabled citizen reporting system</li>
                  <li>• Integration with INCOIS official data</li>
                  <li>• Interactive mapping and visualization</li>
                </ul>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Coverage Areas</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Monitoring all 12 coastal states and union territories of India:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-white/60">
                  <div>• Gujarat</div>
                  <div>• Maharashtra</div>
                  <div>• Goa</div>
                  <div>• Karnataka</div>
                  <div>• Kerala</div>
                  <div>• Tamil Nadu</div>
                  <div>• Puducherry</div>
                  <div>• Andhra Pradesh</div>
                  <div>• Odisha</div>
                  <div>• West Bengal</div>
                  <div>• Andaman & Nicobar</div>
                  <div>• Lakshadweep</div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Emergency Response</h3>
                <p className="text-white/70 leading-relaxed">
                  Coordinated response system connecting local authorities, coast guard, disaster management teams, and
                  coastal communities for rapid emergency response.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)] flex items-center justify-center relative overflow-hidden">
      <style jsx>{`
        @keyframes water-ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes water-wave {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes wave {
          0%, 100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(5px) translateY(-5px) rotate(1deg);
          }
          50% {
            transform: translateX(-5px) translateY(-10px) rotate(-1deg);
          }
          75% {
            transform: translateX(-5px) translateY(-5px) rotate(1deg);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px var(--color-accent), 0 0 10px var(--color-accent), 0 0 15px var(--color-accent);
          }
          50% {
            box-shadow: 0 0 10px var(--color-accent), 0 0 20px var(--color-accent), 0 0 30px var(--color-accent);
          }
        }
        .water-ripple {
          animation: water-ripple 3s ease-out infinite;
        }
        .water-wave {
          animation: water-wave 4s ease-in-out infinite;
        }
        .wave-animation {
          animation: wave 6s ease-in-out infinite;
        }
        .float-animation {
          animation: float 4s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="absolute inset-0">
        {/* Enhanced water ripple effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[var(--color-accent)]/30 rounded-full water-ripple"></div>
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 border-2 border-[var(--color-ocean-foam)]/40 rounded-full water-ripple"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-[var(--color-coral-accent)]/20 rounded-full water-ripple"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-28 h-28 border-2 border-[var(--color-accent)]/25 rounded-full water-ripple"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-36 h-36 border-2 border-[var(--color-accent)]/20 rounded-full water-ripple transform -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Enhanced floating water elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-[var(--color-ocean-foam)]/20 rounded-full blur-lg water-wave"></div>
        <div
          className="absolute top-40 right-20 w-12 h-12 bg-[var(--color-accent)]/30 rounded-full blur-md water-wave"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-[var(--color-ocean-light)]/25 rounded-full blur-xl water-wave"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute top-60 right-1/4 w-14 h-14 bg-[var(--color-coral-accent)]/20 rounded-full blur-lg water-wave"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="text-center relative z-10">
        <div className="w-24 h-24 bg-[var(--color-accent)] rounded-full flex items-center justify-center mb-8 mx-auto pulse-glow">
          <Waves className="w-12 h-12 text-white wave-animation" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 wave-animation">VARUNA</h1>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce"
            style={{ animationDelay: "0.6s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce"
            style={{ animationDelay: "0.8s" }}
          ></div>
        </div>
        <p className="text-white/80 text-lg mb-2 float-animation">Initializing Ocean Monitoring System...</p>
        <p className="text-white/60 text-sm">Connecting to INCOIS • Loading AI Models • Preparing Dashboard</p>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: string
}) {
  return (
    <Card
      className="bg-white/10 backdrop-blur-lg border-white/20 p-6 hover:bg-white/15 transition-all duration-300 float-animation"
      style={{ animationDelay: delay }}
    >
      <div className="text-[var(--color-accent)] mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </Card>
  )
}
