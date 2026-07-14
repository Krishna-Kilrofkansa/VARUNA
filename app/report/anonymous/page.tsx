"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle, Phone, Clock, CheckCircle, Loader2,
  Waves, Brain, Users, TrendingUp, Shield, MapPin
} from "lucide-react"
import Link from "next/link"

const emergencyTypes = [
  { value: "tsunami", label: "Tsunami Warning", color: "bg-red-500" },
  { value: "storm", label: "Severe Storm / Cyclone", color: "bg-purple-500" },
  { value: "coastal_flooding", label: "Coastal Flooding", color: "bg-blue-500" },
  { value: "oil_spill", label: "Oil Spill / Marine Pollution", color: "bg-gray-500" },
  { value: "whale_stranding", label: "Marine Animal Stranding", color: "bg-teal-500" },
  { value: "rip_current", label: "Rip Current / Drowning Risk", color: "bg-orange-500" },
  { value: "high_waves", label: "Abnormal High Waves", color: "bg-cyan-500" },
  { value: "algal_bloom", label: "Algal Bloom / Red Tide", color: "bg-green-500" },
  { value: "other", label: "Other Ocean Emergency", color: "bg-yellow-500" },
]

interface SubmitResult {
  reportId: string
  probabilityScore: number
  trustScore: number
  aiLabel: string
  aiExplanation: string
  socialPostCount: number
  message: string
  trustLabel: { label: string; color: string; action: string }
}

export default function AnonymousReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    emergencyType: "",
    description: "",
    location: "",
    severity: "high",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.emergencyType) return
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hazardType: formData.emergencyType,
          severity: formData.severity,
          description: formData.description,
          contactName: "Anonymous",
          contactPhone: "",
          location: formData.location
            ? { lat: null, lng: null, address: formData.location }
            : null,
          files: [],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Submission failed")
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (result) {
    const prob = result.probabilityScore ?? 0
    const trust = result.trustScore ?? 0
    const trustColor =
      trust >= 8 ? "#ef4444" : trust >= 5 ? "#f97316" : "#eab308"

    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)] flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-4">
          {/* Header card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Report Received & Analyzed</h2>
            <p className="text-white/70 text-sm">
              Report ID: <span className="text-white font-mono">{result.reportId?.slice(-8)}</span>
            </p>
          </Card>

          {/* AI Score cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 text-center">
              <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white/60 text-xs mb-1">AI Probability Score</p>
              <p className="text-3xl font-bold text-white">{prob.toFixed(1)}</p>
              <p className="text-white/50 text-xs">/ 10</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 text-center">
              <Shield className="w-6 h-6 mb-2 mx-auto" style={{ color: trustColor }} />
              <p className="text-white/60 text-xs mb-1">Combined Trust Score</p>
              <p className="text-3xl font-bold" style={{ color: trustColor }}>{trust.toFixed(1)}</p>
              <p className="text-white/50 text-xs">/ 10</p>
            </Card>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-3 text-center">
              <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{result.socialPostCount}</p>
              <p className="text-white/60 text-xs">Social Posts</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-3 text-center">
              <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-white font-bold text-xs mt-1 uppercase">{result.aiLabel?.replace(/_/g, " ")}</p>
              <p className="text-white/60 text-xs">AI Label</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-3 text-center">
              <AlertTriangle className="w-4 h-4 mb-1 mx-auto" style={{ color: trustColor }} />
              <p className="text-white font-bold text-xs mt-1">{result.trustLabel?.label?.split(" ")[0]}</p>
              <p className="text-white/60 text-xs">Confidence</p>
            </Card>
          </div>

          {/* AI Explanation */}
          <Card className="bg-blue-500/10 border border-blue-500/20 p-4">
            <p className="text-blue-300 font-medium text-sm mb-1 flex items-center gap-2">
              <Brain className="w-4 h-4" /> VARUNA AI Analysis
            </p>
            <p className="text-blue-100/80 text-sm">{result.aiExplanation}</p>
          </Card>

          {/* Action taken */}
          <Card className="border p-4" style={{ borderColor: trustColor + "40", background: trustColor + "10" }}>
            <p className="font-medium text-sm" style={{ color: trustColor }}>
              Action Taken: {result.trustLabel?.action}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard">
              <Button className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white">
                View Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)]">
      <header className="bg-red-600/80 backdrop-blur-lg border-b border-red-500/20 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Emergency Ocean Report</h1>
              <p className="text-red-100 text-xs">Anonymous · AI-Analyzed · Instantly Dispatched</p>
            </div>
          </div>
          <Badge className="bg-red-500/20 text-red-200 border-red-500/30 animate-pulse">URGENT</Badge>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
          <div className="space-y-5">
            {/* VARUNA pipeline info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 font-medium text-sm mb-2 flex items-center gap-2">
                <Waves className="w-4 h-4" /> How VARUNA processes your report
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs text-blue-200/80">
                <div className="text-center">
                  <Brain className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  AI scores it 0–10
                </div>
                <div className="text-center">
                  <Users className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                  Social posts found
                </div>
                <div className="text-center">
                  <Shield className="w-4 h-4 mx-auto mb-1 text-green-400" />
                  Trust score computed
                </div>
              </div>
            </div>

            {/* Emergency contacts */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300/90 text-sm">
                  Life-threatening emergency? Call <strong>108</strong> or Coast Guard <strong>1554</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Type of Hazard *</label>
                <Select
                  value={formData.emergencyType}
                  onValueChange={(v) => setFormData((p) => ({ ...p, emergencyType: v }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select hazard type" />
                  </SelectTrigger>
                  <SelectContent>
                    {emergencyTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location (if known)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Juhu Beach, Mumbai or Puri Coast, Odisha"
                  value={formData.location}
                  onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Describe what you observed *
                </label>
                <Textarea
                  placeholder="Describe the hazard in detail — what you see, how severe, how many people affected, anything unusual about the sea/coast..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  rows={5}
                  required
                />
                <p className="text-white/40 text-xs mt-1">
                  More detail = more accurate AI scoring. Minimum 20 characters.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-300/80 text-xs">
                    This report is completely anonymous. VARUNA will analyze it with AI, mine social media
                    for corroborating posts, compute a trust score, and dispatch alerts if confidence is high.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !formData.description || !formData.emergencyType || formData.description.length < 20}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    VARUNA is analyzing your report...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Submit to VARUNA
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-white/10">
              <Link href="/report/authenticated">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent text-sm">
                  Login for verified reporting →
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
