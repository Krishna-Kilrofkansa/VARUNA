"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Waves,
  User,
  Bell,
  Shield,
  Globe,
  ArrowLeft,
  Save,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardSettings() {
  const [settings, setSettings] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    criticalAlertsOnly: false,
    profileVisibility: "public",
    shareLocation: true,
    defaultMapView: "satellite",
    autoRefresh: true,
    refreshInterval: 30,
    language: "en",
  })

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)]">
      <header className="bg-[var(--color-ocean-deep)]/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center pulse-glow"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Settings</h1>
              <p className="text-white/60 text-sm">Customize your dashboard experience</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-[var(--color-accent)]" />
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="text-white mb-2 block">Full Name</Label>
              <Input
                id="fullName"
                value={settings.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-white mb-2 block">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-[var(--color-accent)]" />
            <h2 className="text-xl font-bold text-white">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Email Notifications</Label>
                <p className="text-white/60 text-sm">Receive hazard alerts via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">SMS Notifications</Label>
                <p className="text-white/60 text-sm">Receive critical alerts via SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Push Notifications</Label>
                <p className="text-white/60 text-sm">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Critical Alerts Only</Label>
                <p className="text-white/60 text-sm">Only receive high and critical severity alerts</p>
              </div>
              <Switch
                checked={settings.criticalAlertsOnly}
                onCheckedChange={(checked) => handleInputChange('criticalAlertsOnly', checked)}
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-[var(--color-accent)]" />
            <h2 className="text-xl font-bold text-white">Privacy Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white font-medium mb-2 block">Profile Visibility</Label>
              <Select value={settings.profileVisibility} onValueChange={(value) => handleInputChange('profileVisibility', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Share Location</Label>
                <p className="text-white/60 text-sm">Allow location sharing for better hazard reporting</p>
              </div>
              <Switch
                checked={settings.shareLocation}
                onCheckedChange={(checked) => handleInputChange('shareLocation', checked)}
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-[var(--color-accent)]" />
            <h2 className="text-xl font-bold text-white">Dashboard Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-white font-medium mb-2 block">Default Map View</Label>
              <Select value={settings.defaultMapView} onValueChange={(value) => handleInputChange('defaultMapView', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="street">Street Map</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white font-medium mb-2 block">Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white font-medium mb-2 block">Auto Refresh Interval (seconds)</Label>
              <Input
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                min="10"
                max="300"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Auto Refresh</Label>
                <p className="text-white/60 text-sm">Automatically refresh hazard data</p>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => handleInputChange('autoRefresh', checked)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}