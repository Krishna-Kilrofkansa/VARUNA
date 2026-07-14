"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Waves,
  User,
  UserX,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"



export default function ReportPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)]">
      {/* Header */}
      <header className="bg-[var(--color-ocean-deep)]/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center pulse-glow"
            >
              <Waves className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Report Ocean Hazard</h1>
              <p className="text-white/60 text-sm">Choose your reporting method</p>
            </div>
          </div>
          <Link href="/auth/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Login
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <AlertTriangle className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How would you like to report?</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Choose between authenticated reporting with full features or quick anonymous reporting for emergencies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Authenticated Reporting */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 hover:bg-white/15 transition-all">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Authenticated Reporting</h3>
                <p className="text-white/70 mb-6">
                  Full-featured reporting with account benefits and follow-up capabilities.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">Verified reports with higher priority</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Track report status and updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-white/80">Build reporting history and credibility</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-1">Recommended</p>
                <p className="text-green-300/80 text-sm">
                  Best for detailed reporting with follow-up support
                </p>
              </div>

              <Link href="/auth/login" className="block">
                <Button className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white py-3">
                  Login to Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Anonymous Reporting */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 hover:bg-white/15 transition-all">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[var(--color-coral-accent)] rounded-full flex items-center justify-center mx-auto">
                <UserX className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Anonymous Reporting</h3>
                <p className="text-white/70 mb-6">
                  Quick reporting without registration - perfect for emergencies.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">Instant reporting - no login required</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Complete privacy protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white/80">Ideal for emergency situations</span>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-orange-400 font-medium mb-1">Emergency Ready</p>
                <p className="text-orange-300/80 text-sm">
                  No account needed - report hazards immediately
                </p>
              </div>

              <Link href="/report/anonymous" className="block">
                <Button className="w-full bg-[var(--color-coral-accent)] hover:bg-[var(--color-coral-accent)]/90 text-white py-3">
                  Report Anonymously
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Emergency Notice */}
        <div className="mt-12">
          <Card className="bg-red-500/10 border border-red-500/20 p-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-bold text-lg mb-2">Emergency Situations</h4>
                <p className="text-red-300/90 mb-4">
                  If you're witnessing an immediate life-threatening ocean hazard, please contact emergency services first:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-red-500/20 rounded-lg p-3">
                    <p className="text-red-300 font-medium">Emergency Services</p>
                    <p className="text-red-200">📞 112 / 100</p>
                  </div>
                  <div className="bg-red-500/20 rounded-lg p-3">
                    <p className="text-red-300 font-medium">Coast Guard</p>
                    <p className="text-red-200">📞 1554</p>
                  </div>
                  <div className="bg-red-500/20 rounded-lg p-3">
                    <p className="text-red-300 font-medium">Disaster Helpline</p>
                    <p className="text-red-200">📞 1078</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
