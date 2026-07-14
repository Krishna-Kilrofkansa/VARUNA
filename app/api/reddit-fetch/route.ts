import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { SocialCorpus } from "@/models/SocialCorpus"

// Reddit free tier: 100 QPM — we use 80 to be safe
const SAFE_QPM = 80
const DELAY_MS = Math.ceil((60 * 1000) / SAFE_QPM) // ~750ms between requests

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Subreddits + search queries for Indian ocean hazard keywords
const SEARCH_TASKS = [
  { subreddit: "india",       query: "cyclone coast storm surge sea" },
  { subreddit: "india",       query: "tsunami ocean alert warning India" },
  { subreddit: "india",       query: "oil spill sea pollution India" },
  { subreddit: "india",       query: "whale stranding beach coast India" },
  { subreddit: "Kerala",      query: "cyclone flood coast sea storm" },
  { subreddit: "Kerala",      query: "fishermen sea danger alert" },
  { subreddit: "Chennai",     query: "cyclone flood coast beach sea" },
  { subreddit: "Chennai",     query: "oil spill marina beach pollution" },
  { subreddit: "mumbai",      query: "storm surge flood coast beach" },
  { subreddit: "Goa",         query: "rip current beach danger drowning waves" },
  { subreddit: "Odisha",      query: "cyclone coast landfall storm" },
  { subreddit: "WestBengal",  query: "cyclone amphan yaas bay bengal coast" },
]

// Map keywords to hazard types
function inferHazardType(title: string, body: string): string {
  const text = (title + " " + body).toLowerCase()
  if (text.match(/cyclone|hurricane|typhoon|storm surge|landfall/)) return "cyclone"
  if (text.match(/tsunami|seismic|earthquake|tidal wave/)) return "tsunami"
  if (text.match(/oil spill|oil slick|petroleum|crude|tar ball/)) return "oil_spill"
  if (text.match(/whale|dolphin|stranding|beached/)) return "whale_stranding"
  if (text.match(/algal?|red tide|bloom|bioluminescen/)) return "algal_bloom"
  if (text.match(/rip current|drowning|swept|beach danger|rough sea|high wave/)) return "rip_current"
  if (text.match(/flood|inundation|surge|waterlogging/)) return "coastal_flooding"
  if (text.match(/plastic|garbage|debris|trash|pollution/)) return "marine_debris"
  return "ocean_anomaly"
}

// Extract keywords from title+body
function extractKeywords(text: string): string[] {
  const important = [
    "cyclone","tsunami","flood","storm","surge","wave","coast","beach","sea","ocean",
    "oil","spill","whale","stranding","algal","bloom","rip","current","drowning",
    "fishermen","fishing","pollution","debris","plastic","earthquake","seismic",
    "kerala","chennai","mumbai","odisha","goa","bengal","gujarat","andhra",
    "evacuation","warning","alert","disaster","rescue","ndrf",
  ]
  const words = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)
  return [...new Set(words.filter((w) => important.includes(w)))].slice(0, 12)
}

export async function POST() {
  try {
    await dbConnect()

    let totalSaved = 0
    let totalFetched = 0
    const errors: string[] = []

    for (const task of SEARCH_TASKS) {
      try {
        await sleep(DELAY_MS)

        const url = `https://www.reddit.com/r/${task.subreddit}/search.json?q=${encodeURIComponent(task.query)}&sort=new&limit=25&restrict_sr=true&t=year`

        const res = await fetch(url, {
          headers: {
            "User-Agent": "VARUNA-OceanHazard-Monitor/1.0 (SIH2024 project; contact: varuna@ocean.in)",
            "Accept": "application/json",
          },
          next: { revalidate: 0 },
        })

        if (!res.ok) {
          errors.push(`r/${task.subreddit} HTTP ${res.status}`)
          continue
        }

        const data = await res.json()
        const posts = data?.data?.children || []
        totalFetched += posts.length

        for (const post of posts) {
          const p = post.data
          if (!p || p.score < 2) continue // skip low-quality posts

          const fullText = `${p.title} ${p.selftext || ""}`.trim()
          const hazardType = inferHazardType(p.title, p.selftext || "")
          const keywords = extractKeywords(fullText)

          if (keywords.length === 0) continue // skip irrelevant posts

          // Upsert by reddit post ID to avoid duplicates
          const result = await SocialCorpus.updateOne(
            { redditId: p.id },
            {
              $setOnInsert: {
                redditId: p.id,
                text: fullText.slice(0, 1000),
                location: `r/${task.subreddit}`,
                locationLat: null,
                locationLng: null,
                platform: "reddit",
                author: `u/${p.author}`,
                timestamp: new Date(p.created_utc * 1000),
                keywords,
                hazardType,
                engagement: p.score,
                upvoteRatio: p.upvote_ratio,
                url: `https://reddit.com${p.permalink}`,
                subreddit: task.subreddit,
                numComments: p.num_comments,
              },
            },
            { upsert: true }
          )

          if (result.upsertedCount > 0) totalSaved++
        }
      } catch (err: any) {
        errors.push(`r/${task.subreddit}: ${err.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      totalFetched,
      newPostsSaved: totalSaved,
      subredditsSearched: SEARCH_TASKS.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Fetched ${totalFetched} posts, saved ${totalSaved} new ones to MongoDB`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const redditCount = await SocialCorpus.countDocuments({ platform: "reddit" })
    const total = await SocialCorpus.countDocuments({})
    return NextResponse.json({ redditPosts: redditCount, totalPosts: total })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
