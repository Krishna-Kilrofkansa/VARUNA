"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Twitter, Facebook, Instagram, MessageCircle, TrendingUp,
  AlertTriangle, Heart, Share, MapPin, Clock, Bot, Zap,
  RefreshCw, Search, Database, BarChart3, Activity, Download,
} from "lucide-react"

// Reddit SVG icon (no lucide equivalent)
const RedditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)

interface SocialPost {
  _id?: string
  text: string
  location: string
  platform: string
  author: string
  timestamp: string
  keywords: string[]
  hazardType: string
  engagement: number
}

interface TrendingKeyword { _id: string; count: number }
interface PlatformStat { _id: string; count: number }
interface HazardStat { _id: string; count: number }

const PLATFORM_ICONS: Record<string, any> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  reddit: RedditIcon,
}

const HAZARD_COLORS: Record<string, string> = {
  cyclone: "bg-purple-500",
  tsunami: "bg-red-500",
  oil_spill: "bg-gray-500",
  storm_surge: "bg-blue-600",
  coastal_flooding: "bg-blue-400",
  high_waves: "bg-cyan-500",
  marine_debris: "bg-green-600",
  whale_stranding: "bg-teal-500",
  rip_current: "bg-orange-500",
  algal_bloom: "bg-green-400",
  seismic_activity: "bg-yellow-600",
  jellyfish_bloom: "bg-pink-400",
}

export default function SocialMediaIntelligence() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [trending, setTrending] = useState<TrendingKeyword[]>([])
  const [platforms, setPlatforms] = useState<PlatformStat[]>([])
  const [hazardDist, setHazardDist] = useState<HazardStat[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [redditFetching, setRedditFetching] = useState(false)
  const [redditResult, setRedditResult] = useState<{ saved: number; fetched: number } | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [hazardFilter, setHazardFilter] = useState("all")

  const fetchSocial = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: "30" })
      if (hazardFilter !== "all") params.set("hazardType", hazardFilter)
      if (locationFilter) params.set("location", locationFilter)

      const res = await fetch(`/api/social-mining?${params}`)
      const data = await res.json()

      if (data.posts) {
        setPosts(data.posts)
        setTrending(data.trending || [])
        setPlatforms(data.platforms || [])
        setHazardDist(data.hazardDist || [])
        setTotal(data.total || 0)
      }
    } catch (err) {
      console.error("Failed to fetch social data", err)
    } finally {
      setLoading(false)
    }
  }, [hazardFilter, locationFilter])

  const checkSeedStatus = async () => {
    try {
      const res = await fetch("/api/seed")
      const data = await res.json()
      setSeeded(data.seeded)
      if (data.seeded) fetchSocial()
    } catch {}
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch("/api/seed", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setSeeded(true)
        fetchSocial()
      }
    } catch (err) {
      console.error("Seed failed", err)
    } finally {
      setSeeding(false)
    }
  }

  const handleRedditFetch = async () => {
    setRedditFetching(true)
    setRedditResult(null)
    try {
      const res = await fetch("/api/reddit-fetch", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setRedditResult({ saved: data.newPostsSaved, fetched: data.totalFetched })
        fetchSocial() // refresh the feed
      }
    } catch (err) {
      console.error("Reddit fetch failed", err)
    } finally {
      setRedditFetching(false)
    }
  }

  useEffect(() => { checkSeedStatus() }, [])
  useEffect(() => { if (seeded) fetchSocial() }, [seeded, fetchSocial])

  const filteredPosts = posts.filter(p => {
    if (!searchKeyword) return true
    const q = searchKeyword.toLowerCase()
    return p.text.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) ||
      p.hazardType.toLowerCase().includes(q)
  })

  const getPlatformIcon = (platform: string) => {
    const Icon = PLATFORM_ICONS[platform] || MessageCircle
    return <Icon className="h-4 w-4" />
  }

  const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement || 0), 0)

  // ── NOT SEEDED STATE ────────────────────────────────────────────────────────
  if (!seeded && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
        <Card className="bg-slate-800/50 border-blue-800/30 p-10 text-center max-w-md">
          <Database className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Initialize Social Corpus</h2>
          <p className="text-blue-200 mb-6 text-sm">
            Load {">"}45 real Indian coastal social media posts (Cyclone Fani, Amphan, Tauktae, Ennore oil spill, 
            Tamil Nadu whale strandings, and more) into the database to enable social media intelligence.
          </p>
          <Button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            {seeding ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading Dataset...</>
            ) : (
              <><Database className="h-4 w-4 mr-2" /> Load Real Dataset</>
            )}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Social Media Intelligence</h1>
                <p className="text-blue-200 text-sm">Real Indian Coastal Event Corpus · {total} posts indexed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">DB Live</span>
              </div>
              {/* Reddit Live Fetch Button */}
              <Button
                onClick={handleRedditFetch}
                disabled={redditFetching}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {redditFetching ? (
                  <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Fetching Reddit...</>
                ) : (
                  <><RedditIcon className="h-4 w-4 mr-1" /> Fetch Live Reddit</>
                )}
              </Button>
              {redditResult && (
                <span className="text-xs text-orange-300 bg-orange-900/30 px-2 py-1 rounded">
                  +{redditResult.saved} new / {redditResult.fetched} scanned
                </span>
              )}
              <Button
                onClick={() => fetchSocial()}
                size="sm"
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-800/50 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Posts", value: total, icon: MessageCircle, color: "text-blue-400" },
            { label: "Total Engagement", value: totalEngagement.toLocaleString(), icon: Heart, color: "text-pink-400" },
            { label: "Hazard Types", value: hazardDist.length, icon: AlertTriangle, color: "text-orange-400" },
            { label: "Trending Keywords", value: trending.length, icon: TrendingUp, color: "text-green-400" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-800/50 border-blue-800/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-xs">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-blue-800/30">
            <TabsTrigger value="feed" className="data-[state=active]:bg-blue-600">Live Feed</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600">Trending</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
            <TabsTrigger value="mine" className="data-[state=active]:bg-blue-600">Mine Reports</TabsTrigger>
          </TabsList>

          {/* ── LIVE FEED ── */}
          <TabsContent value="feed" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-40">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 bg-slate-800 border-blue-800/30 text-white"
                />
              </div>
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onBlur={fetchSocial}
                className="w-48 bg-slate-800 border-blue-800/30 text-white"
              />
              <Select value={hazardFilter} onValueChange={(v) => setHazardFilter(v)}>
                <SelectTrigger className="w-44 bg-slate-800 border-blue-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hazards</SelectItem>
                  <SelectItem value="cyclone">Cyclone</SelectItem>
                  <SelectItem value="tsunami">Tsunami</SelectItem>
                  <SelectItem value="oil_spill">Oil Spill</SelectItem>
                  <SelectItem value="storm_surge">Storm Surge</SelectItem>
                  <SelectItem value="whale_stranding">Marine Stranding</SelectItem>
                  <SelectItem value="rip_current">Rip Current</SelectItem>
                  <SelectItem value="algal_bloom">Algal Bloom</SelectItem>
                  <SelectItem value="marine_debris">Marine Debris</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <Card key={i} className="bg-slate-800/50 border-blue-800/30 h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post, i) => (
                  <Card key={i} className={`bg-slate-800/50 border-blue-800/30 hover:border-blue-600/50 transition-all ${
                    post.engagement > 5000 ? "ring-1 ring-orange-500/40" : ""
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-blue-400">{getPlatformIcon(post.platform)}</span>
                          <span className="text-white font-medium text-sm truncate">{post.author}</span>
                        </div>
                        <Badge className={`${HAZARD_COLORS[post.hazardType] || "bg-slate-500"} text-white text-xs shrink-0`}>
                          {post.hazardType?.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{post.text}</p>

                      <div className="flex items-center justify-between text-xs text-blue-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-28">{post.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-blue-200">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-pink-400" />
                          {post.engagement?.toLocaleString() || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share className="h-3 w-3" />
                          {Math.floor((post.engagement || 0) * 0.3)}
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1">
                        {(post.keywords || []).slice(0, 3).map((k, ki) => (
                          <span key={ki} className="bg-blue-900/40 text-blue-300 text-xs px-1.5 py-0.5 rounded">
                            #{k}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── TRENDING ── */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" /> Trending Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trending.map((t, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-mono text-xs w-5">#{i + 1}</span>
                        <span className="text-white text-sm">#{t._id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${Math.min(100, (t.count / (trending[0]?.count || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-blue-300 text-xs w-8 text-right">{t.count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" /> Hazard Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hazardDist.map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${HAZARD_COLORS[h._id] || "bg-slate-500"}`} />
                        <span className="text-white text-sm capitalize">{h._id?.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${HAZARD_COLORS[h._id] || "bg-slate-500"}`}
                            style={{ width: `${Math.min(100, (h.count / (hazardDist[0]?.count || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-blue-300 text-xs w-6 text-right">{h.count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Platform Distribution */}
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-white">Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  {platforms.map((p, i) => {
                    const Icon = PLATFORM_ICONS[p._id] || MessageCircle
                    const colors: Record<string,string> = { twitter: "text-blue-400", facebook: "text-blue-600", instagram: "text-pink-500" }
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${colors[p._id] || "text-gray-400"}`} />
                        <div>
                          <p className="text-white font-medium capitalize">{p._id}</p>
                          <p className="text-blue-300 text-sm">{p.count} posts</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ANALYTICS ── */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" /> Engagement by Hazard Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      posts.reduce((acc: Record<string, number>, p) => {
                        acc[p.hazardType] = (acc[p.hazardType] || 0) + (p.engagement || 0)
                        return acc
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([hazard, eng], i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-white text-sm capitalize">{hazard.replace(/_/g, " ")}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${Math.min(100, (eng / totalEngagement) * 100 * 3)}%` }}
                              />
                            </div>
                            <span className="text-blue-300 text-xs">{eng.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" /> Top Coastal Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      posts.reduce((acc: Record<string, number>, p) => {
                        const loc = p.location?.split(",")[0] || "Unknown"
                        acc[loc] = (acc[loc] || 0) + 1
                        return acc
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([loc, count], i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-blue-400" />
                            <span className="text-white text-sm">{loc}</span>
                          </div>
                          <Badge className="bg-blue-900/50 text-blue-300 border-blue-800/30">{count} posts</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── MINE REPORTS ── */}
          <TabsContent value="mine" className="space-y-4">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" /> Manual Social Mining
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-200 text-sm">
                  This is what VARUNA does automatically when a report comes in. Enter keywords and location 
                  to search the social corpus and see corroborating posts.
                </p>
                <MiningPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MiningPanel() {
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const mine = async () => {
    if (!keywords.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/social-mining", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
          location,
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Keywords (comma-separated): cyclone, puri, waves"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          className="flex-1 bg-slate-700 border-blue-800/30 text-white"
        />
        <Input
          placeholder="Location: Chennai, Odisha"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-48 bg-slate-700 border-blue-800/30 text-white"
        />
        <Button onClick={mine} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4 mr-1" />Mine</>}
        </Button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-sm px-3 py-1">
              {result.matchCount} matching posts found
            </Badge>
            {result.matchCount > 0 && (
              <span className="text-blue-300 text-sm">
                Social boost: +{Math.min(10, result.matchCount / 5).toFixed(1)} trust points
              </span>
            )}
          </div>
          {(result.posts || []).slice(0, 5).map((p: any, i: number) => (
            <div key={i} className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 text-xs">{p.location}</span>
                <span className="text-blue-400 text-xs">{new Date(p.timestamp).toLocaleDateString("en-IN")}</span>
              </div>
              <p className="text-white text-sm">{p.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
