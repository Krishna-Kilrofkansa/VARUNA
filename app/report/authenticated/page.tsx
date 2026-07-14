"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Camera,
  Video,
  Upload,
  AlertTriangle,
  Waves,
  Navigation,
  Clock,
  CheckCircle,
  X,
  Loader2,
  Phone,
  User,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const hazardTypes = [
  { value: "storm", label: "Storm/Cyclone", icon: "🌪️", color: "bg-purple-500" },
  { value: "tsunami", label: "Tsunami Warning", icon: "🌊", color: "bg-red-500" },
  { value: "flooding", label: "Coastal Flooding", icon: "💧", color: "bg-blue-500" },
  { value: "waves", label: "High Waves", icon: "🌊", color: "bg-cyan-500" },
  { value: "erosion", label: "Coastal Erosion", icon: "🏖️", color: "bg-orange-500" },
  { value: "pollution", label: "Marine Pollution", icon: "🛢️", color: "bg-gray-500" },
  { value: "other", label: "Other Hazard", icon: "⚠️", color: "bg-yellow-500" },
]

const severityLevels = [
  { value: "low", label: "Low - Minor concern", color: "text-green-400" },
  { value: "medium", label: "Medium - Moderate risk", color: "text-yellow-400" },
  { value: "high", label: "High - Significant danger", color: "text-orange-400" },
  { value: "critical", label: "Critical - Immediate threat", color: "text-red-400" },
]

interface PipelineResult {
  reportId: string
  probabilityScore: number
  trustScore: number
  aiLabel: string
  aiExplanation: string
  socialPostCount: number
  message: string
  trustLabel: { label: string; color: string; action: string }
}

export default function AuthenticatedReportPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null)
  const [formData, setFormData] = useState({
    hazardType: "",
    severity: "",
    description: "",
    contactName: "",
    contactPhone: "",
  })
  const router = useRouter()

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
          setLocationLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationLoading(false)
        },
      )
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
          files: uploadedFiles.map((file) => file.name),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save report");
      setPipelineResult(data);
      setStep(4);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Report Details"
      case 2:
        return "Location & Media"
      case 3:
        return "Contact Information"
      case 4:
        return "Report Submitted"
      default:
        return "Report Hazard"
    }
  }

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
              <h1 className="text-2xl font-bold text-white">Authenticated Report</h1>
              <p className="text-white/60 text-sm">{getStepTitle()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/30">
              Step {step} of 4
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Verified User
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  stepNum <= step
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                    : "border-white/30 text-white/50"
                }`}
              >
                {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-[var(--color-accent)] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Report Details */}
        {step === 1 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <AlertTriangle className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">What type of hazard are you reporting?</h2>
                <p className="text-white/70">Select the category that best describes the ocean hazard</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hazardTypes.map((hazard) => (
                  <button
                    key={hazard.value}
                    onClick={() => setFormData((prev) => ({ ...prev, hazardType: hazard.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.hazardType === hazard.value
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${hazard.color} flex items-center justify-center text-white text-lg`}
                      >
                        {hazard.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{hazard.label}</h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white text-lg mb-3 block">How severe is this hazard?</Label>
                  <div className="space-y-2">
                    {severityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFormData((prev) => ({ ...prev, severity: level.value }))}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          formData.severity === level.value
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className={`font-medium ${level.color}`}>{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white text-lg mb-3 block">
                    Describe what you observed
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about the hazard, including what you saw, when it started, and any other relevant information..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                    rows={5}
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.hazardType || !formData.severity}
                className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white py-3 text-lg"
              >
                Continue to Location & Media
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Location & Media */}
        {step === 2 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Location & Evidence</h2>
                <p className="text-white/70">Help us pinpoint the exact location and provide visual evidence</p>
              </div>

              <div className="space-y-4">
                <Label className="text-white text-lg block">Current Location</Label>
                {location ? (
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Navigation className="w-5 h-5 text-[var(--color-accent)]" />
                        <div>
                          <p className="text-white font-medium">Location Detected</p>
                          <p className="text-white/60 text-sm">{location.address}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
                  >
                    {locationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Current Location
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-white text-lg block">Upload Photos or Videos (Optional)</Label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <Camera className="w-8 h-8 text-white/60" />
                      <Video className="w-8 h-8 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/70 mb-2">Drag and drop files here, or click to select</p>
                      <p className="text-white/50 text-sm">Supports JPG, PNG, MP4, MOV (max 10MB each)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </Label>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Uploaded Files ({uploadedFiles.length})</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-3">
                            {file.type.startsWith("image/") ? (
                              <Camera className="w-4 h-4 text-[var(--color-accent)]" />
                            ) : (
                              <Video className="w-4 h-4 text-[var(--color-accent)]" />
                            )}
                            <div>
                              <p className="text-white text-sm font-medium">{file.name}</p>
                              <p className="text-white/60 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!location}
                  className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
                >
                  Continue to Contact Info
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                <p className="text-white/70">Verify your contact details for follow-up</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactName" className="text-white mb-2 block">
                    Your Name
                  </Label>
                  <Input
                    id="contactName"
                    placeholder="Enter your full name"
                    value={formData.contactName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-white mb-2 block">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium mb-1">Verified Account Benefits</p>
                    <p className="text-green-300/80 text-sm">
                      Your report will receive priority processing and you'll get status updates via SMS/email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.contactName || !formData.contactPhone}
                  className="flex-1 bg-[var(--color-coral-accent)] hover:bg-[var(--color-coral-accent)]/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Success — VARUNA Pipeline Result */}
        {step === 4 && (
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Report Analyzed by VARUNA</h2>
              <p className="text-white/60 text-sm">
                Report ID: <span className="font-mono text-white">{pipelineResult?.reportId?.slice(-8) || Date.now().toString().slice(-6)}</span>
              </p>
            </Card>

            {pipelineResult && (
              <>
                {/* Score cards */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 text-center">
                    <p className="text-white/50 text-xs mb-1">AI Probability</p>
                    <p className="text-3xl font-bold text-blue-400">{pipelineResult.probabilityScore.toFixed(1)}</p>
                    <p className="text-white/40 text-xs">/ 10</p>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 text-center">
                    <p className="text-white/50 text-xs mb-1">Trust Score</p>
                    <p className="text-3xl font-bold" style={{ color: pipelineResult.trustLabel?.color }}>
                      {pipelineResult.trustScore.toFixed(1)}
                    </p>
                    <p className="text-white/40 text-xs">/ 10</p>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 text-center">
                    <p className="text-white/50 text-xs mb-1">Social Posts</p>
                    <p className="text-3xl font-bold text-purple-400">{pipelineResult.socialPostCount}</p>
                    <p className="text-white/40 text-xs">corroborating</p>
                  </Card>
                </div>

                {/* AI Label + Explanation */}
                <Card className="bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 uppercase text-xs">
                      {pipelineResult.aiLabel?.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-blue-300 text-sm font-medium">{pipelineResult.trustLabel?.label}</span>
                  </div>
                  <p className="text-blue-100/80 text-sm">{pipelineResult.aiExplanation}</p>
                </Card>

                {/* Action taken */}
                <Card className="border p-3" style={{
                  borderColor: (pipelineResult.trustLabel?.color || "#eab308") + "50",
                  background: (pipelineResult.trustLabel?.color || "#eab308") + "15",
                }}>
                  <p className="text-sm font-medium" style={{ color: pipelineResult.trustLabel?.color }}>
                    ✓ {pipelineResult.trustLabel?.action}
                  </p>
                </Card>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
              >
                View Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1)
                  setPipelineResult(null)
                  setFormData({ hazardType: "", severity: "", description: "", contactName: "", contactPhone: "" })
                  setUploadedFiles([])
                }}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Report Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}