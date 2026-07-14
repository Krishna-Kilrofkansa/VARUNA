"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts"
import {
  Activity, AlertTriangle, Brain, Users, TrendingUp, MapPin,
  RefreshCw, Shield, Waves, Clock, CheckCircle, XCircle,
} from "lucide-react"

const COLORS = ["#6366f1", "#ef4444", "#f97316", "#3b82f6", "#22c55e", "#a855f7", "#06b6d4", "#eab308"]

interface AnalyticsData {
  summary: {
    totalReports: number
    avgProbability: number
    avgTrust: number
    totalSocialPosts: number
    reportsWithSocial: number
    highConfidenceCount: number
  }
  byHazardType: { _id: string; count: number; avgTrust: number }[]
  bySeverity: { _id: string; count: number }[]
  byStatus: { _id: string; count: number }[]
  byTrustScore: { _id: number; count: number }[]
  recentTrend: { _id: string; count: number; avgTrust: number }[]
  topLocations: { _id: string; count: number; avgTrust: number; lat: number; lng: number }[]
  highConfidenceAlerts: any[]
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
}

const STATUS_COLORS: Record<string, string> = {
  verified: "#22c55e",
  pending: "#eab308",
  dismissed: "#ef4444",
}

const TRUST_BUCKET_LABELS: Record<number, string> = {
  0: "0–2 (Very Low)",
  2: "2–4 (Low)",
  4: "4–6 (Medium)",
  6: "6–8 (High)",
  8: "8–10 (Critical)",
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAnalytics = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/analytics")
      if (!res.ok) throw new Error("Failed to load analytics")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnalytics() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading VARUNA Analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
        <Card className="bg-slate-800/50 border-red-500/30 p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">No Report Data Yet</h2>
          <p className="text-blue-200 text-sm mb-6">
            Submit some hazard reports first to see analytics. Make sure your MongoDB URI is configured in .env.local
          </p>
          <Button onClick={fetchAnalytics} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </Card>
      </div>
    )
  }

  const { summary, byHazardType, bySeverity, byStatus, byTrustScore, recentTrend, topLocations, highConfidenceAlerts } = data

  const hazardChartData = byHazardType.map(h => ({
    name: h._id?.replace(/_/g, " "),
    reports: h.count,
    avgTrust: Number(h.avgTrust?.toFixed(1) || 0),
  }))

  const trustBucketData = byTrustScore.map(b => ({
    name: TRUST_BUCKET_LABELS[b._id as number] || `${b._id}+`,
    count: b.count,
  }))

  const trendData = recentTrend.slice(-14).map(t => ({
    date: new Date(t._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    reports: t.count,
    avgTrust: Number(t.avgTrust?.toFixed(1) || 0),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">VARUNA Analytics</h1>
                <p className="text-blue-200 text-sm">Real-time ocean hazard intelligence dashboard</p>
              </div>
            </div>
            <Button
              onClick={fetchAnalytics}
              size="sm"
              variant="outline"
              className="border-blue-700 text-blue-300 hover:bg-blue-800/50 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Reports", value: summary.totalReports, icon: Waves, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Avg AI Score", value: `${summary.avgProbability}/10`, icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
            { label: "Avg Trust Score", value: `${summary.avgTrust}/10`, icon: Shield, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Social Posts Mined", value: summary.totalSocialPosts, icon: Users, color: "text-pink-400", bg: "bg-pink-500/10" },
            { label: "Reports Corroborated", value: summary.reportsWithSocial, icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10" },
            { label: "High Confidence", value: summary.highConfidenceCount, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
          ].map((kpi) => (
            <Card key={kpi.label} className={`bg-slate-800/50 border-blue-800/30 ${kpi.bg}`}>
              <CardContent className="p-4">
                <kpi.icon className={`h-6 w-6 ${kpi.color} mb-2`} />
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <p className="text-blue-200 text-xs mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── High Confidence Alerts ── */}
        {highConfidenceAlerts.length > 0 && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                High Confidence Alerts (Trust ≥ 8)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {highConfidenceAlerts.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30 uppercase text-xs">
                        {alert.aiLabel?.replace(/_/g, " ") || alert.hazardType}
                      </Badge>
                      <div className="flex items-center gap-1 text-blue-200 text-sm">
                        <MapPin className="h-3 w-3" />
                        {alert.location?.address || "Unknown"}
                      </div>
                      <div className="flex items-center gap-1 text-blue-300 text-xs">
                        <Users className="h-3 w-3" />
                        {alert.socialPostCount} posts
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-red-300 font-bold text-lg">{alert.trustScore?.toFixed(1)}</p>
                        <p className="text-blue-300 text-xs">trust score</p>
                      </div>
                      <div className="flex items-center gap-1 text-blue-300 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hazard Type Bar Chart */}
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-white">Reports by Hazard Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hazardChartData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="name" tick={{ fill: "#93c5fd", fontSize: 10 }} angle={-35} textAnchor="end" />
                  <YAxis tick={{ fill: "#93c5fd", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #1e3a5f", color: "#fff" }} />
                  <Bar dataKey="reports" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Avg Trust by Hazard */}
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-white">Average Trust Score by Hazard</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hazardChartData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="name" tick={{ fill: "#93c5fd", fontSize: 10 }} angle={-35} textAnchor="end" />
                  <YAxis domain={[0, 10]} tick={{ fill: "#93c5fd", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #1e3a5f", color: "#fff" }} />
                  <Bar dataKey="avgTrust" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Severity Pie */}
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader><CardTitle className="text-white">By Severity</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={bySeverity.map(s => ({ name: s._id, value: s.count }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {bySeverity.map((s, i) => (
                      <Cell key={i} fill={SEVERITY_COLORS[s._id] || COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #1e3a5f", color: "#fff" }} />
                  <Legend formatter={(v) => <span style={{ color: "#93c5fd", textTransform: "capitalize" }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Pie */}
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader><CardTitle className="text-white">By Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={byStatus.map(s => ({ name: s._id, value: s.count }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {byStatus.map((s, i) => (
                      <Cell key={i} fill={STATUS_COLORS[s._id] || COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #1e3a5f", color: "#fff" }} />
                  <Legend formatter={(v) => <span style={{ color: "#93c5fd", textTransform: "capitalize" }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trust Distribution */}
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader><CardTitle className="text-white">Trust Score Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2">
                {trustBucketData.map((b, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-200">{b.name}</span>
                      <span className="text-white font-medium">{b.count}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (b.count / (summary.totalReports || 1)) * 100)}%`,
                          background: COLORS[i],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Trend Line ── */}
        {trendData.length > 0 && (
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-white">Report Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" tick={{ fill: "#93c5fd", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#93c5fd", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: "#93c5fd", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #1e3a5f", color: "#fff" }} />
                  <Legend formatter={(v) => <span style={{ color: "#93c5fd" }}>{v}</span>} />
                  <Line yAxisId="left" type="monotone" dataKey="reports" stroke="#6366f1" strokeWidth={2} dot={false} name="Reports" />
                  <Line yAxisId="right" type="monotone" dataKey="avgTrust" stroke="#22c55e" strokeWidth={2} dot={false} name="Avg Trust" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* ── Top Locations ── */}
        {topLocations.length > 0 && (
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" /> Top Reported Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {topLocations.map((loc, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-blue-400 font-mono text-sm w-5 shrink-0">#{i + 1}</span>
                      <span className="text-white text-sm truncate">{loc._id}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-blue-900/50 text-blue-300 border-blue-800/30 text-xs">{loc.count}</Badge>
                      <span className="text-green-400 text-xs">{loc.avgTrust?.toFixed(1)}⚡</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
