"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Send,
  Phone,
  Mail,
  AlertCircle,
  Shield,
  Zap,
  Globe,
  LogOut,
} from "lucide-react";

// interface EmergencyAlert {
//   id: string
//   type: string
//   severity: "critical" | "high" | "medium" | "low"
//   location: {
//     lat: number
//     lng: number
//     name: string
//   }
//   timestamp: string
//   source: string
//   description: string
//   verified: boolean
// }
interface EmergencyAlert {
  id: string;
  title?: string;
  severity: "critical" | "high" | "medium" | "low";
  type?: string;
  location: { lat: number | null; lng: number | null; name: string } | string;
  coordinates?: [number, number];
  timestamp?: string;
  status?: "active" | "resolved" | "investigating" | "pending" | "verified" | "dismissed";
  description: string;
  affectedAreas?: string[];
  estimatedImpact?: number;
  reportedBy?: string;
  contactName?: string;
  contactPhone?: string;
  hazardType: string;
  // AI Pipeline
  verified?: boolean;
  probabilityScore?: number;
  trustScore?: number;
  aiLabel?: string;
  aiExplanation?: string;
  socialPostCount?: number;
  keywords?: string[];
  source?: string;
  createdAt?: string;
}

interface ResponseTeam {
  id: string;
  name: string;
  type: "coast-guard" | "navy" | "disaster-response" | "medical";
  status: "available" | "deployed" | "offline";
  location: string;
  contact: string;
  specialization: string[];
}

export default function AdminPanel() {
  //const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: "1",
      title: "High Tsunami Risk - Chennai Coast",
      hazardType: "Tsunami", // new
      severity: "critical",
      type: "Tsunami",
      location: "Chennai, Tamil Nadu",
      coordinates: [13.0827, 80.2707],
      reportedBy: "Seismic Monitoring Station",
      timestamp: "2024-01-15T14:30:00Z",
      status: "active",
      description:
        "Underwater earthquake detected 150km off Chennai coast. Tsunami waves expected within 2 hours.",
      affectedAreas: ["Chennai", "Mahabalipuram", "Pondicherry"],
      estimatedImpact: 500000,
      contactName: "Dr. R. Kumar",
      contactPhone: "+91-44-1234-5678",
    },
    {
      id: "2",
      title: "Severe Cyclone Warning - Odisha",
      hazardType: "Cyclone", // new
      severity: "high",
      type: "Cyclone",
      location: "Puri, Odisha",
      coordinates: [19.8135, 85.8312],
      reportedBy: "IMD Weather Station",
      timestamp: "2024-01-15T12:15:00Z",
      status: "investigating",
      description:
        "Category 4 cyclone approaching Odisha coast. Wind speeds up to 180 km/h expected.",
      affectedAreas: ["Puri", "Bhubaneswar", "Cuttack"],
      estimatedImpact: 300000,
      contactName: "Mr. S. Das",
      contactPhone: "+91-891-2345-6789",
    },
  ]);

  const [teams, setTeams] = useState<ResponseTeam[]>([
    {
      id: "1",
      name: "Chennai Coast Guard Unit",
      type: "coast-guard",
      status: "deployed",
      location: "Chennai Port",
      contact: "+91-44-2536-1234",
      specialization: ["Search & Rescue", "Maritime Security"],
    },
    {
      id: "2",
      name: "Eastern Naval Command",
      type: "navy",
      status: "available",
      location: "Visakhapatnam",
      contact: "+91-891-256-7890",
      specialization: ["Heavy Rescue", "Evacuation"],
    },
  ]);

  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(
    null
  );
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [alertFilter, setAlertFilter] = useState("all");
  const detailRef = useRef<HTMLDivElement>(null);
  // Add this inside your AdminPanel component
  useEffect(() => {
    if (selectedAlert && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedAlert]);

  // Fetch alerts from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/hazardsadmin");
        const data = await res.json();
        if (data.hazards) {
          setAlerts(data.hazards);
        }
      } catch (error) {
        console.error("Error fetching hazards:", error);
      }
    };
    fetchAlerts();
  }, []);

  const verifyAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified", verified: true }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, verified: true, status: "active" } : a))
        );
        if (selectedAlert?.id === id) {
          setSelectedAlert((prev) => prev ? { ...prev, verified: true } : null);
        }
      }
    } catch (err) {
      console.error("Verify failed:", err);
    }
  };

  const dismissAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dismissed", verified: false }),
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
        setSelectedAlert(null);
      }
    } catch (err) {
      console.error("Dismiss failed:", err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (verified: boolean) => {
    return verified
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "deployed":
        return "bg-blue-100 text-blue-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alertFilter === "all" ||
      (alertFilter === "active" ? !alert.verified : alert.verified)
  );

  const timestamp = selectedAlert?.timestamp;
  let displayTime = "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Emergency Command Center
                </h1>
                <p className="text-blue-200">Ocean Hazard Monitoring - India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">System Online</span>
              </div>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-300 hover:bg-blue-600 bg-transparent"
              >
                <Phone className="h-4 w-4 mr-2" />
                Emergency Hotline
              </Button>
              <Button
                variant="outline"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                onClick={() => {
                  sessionStorage.removeItem("varuna-loaded");
                  window.location.href = "/";
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-blue-800/30">
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-blue-600"
            >
              Active Alerts
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-blue-600"
            >
              Response Teams
            </TabsTrigger>
            <TabsTrigger
              value="broadcast"
              className="data-[state=active]:bg-blue-600"
            >
              Emergency Broadcast
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-600"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Active Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Emergency Alerts
              </h2>
              <Select value={alertFilter} onValueChange={setAlertFilter}>
                <SelectTrigger className="w-48 bg-slate-800 border-blue-800/30">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="active">Unverified</SelectItem>
                  <SelectItem value="resolved">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`bg-slate-800/50 border-blue-800/30 cursor-pointer transition-all hover:bg-slate-800/70 ${
                      selectedAlert?.id === alert.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} animate-pulse`} />
                          <div>
                            <CardTitle className="text-white text-base">
                              {alert.hazardType} &bull; {alert.severity}
                            </CardTitle>
                            <CardDescription className="text-blue-200">
                              {alert.location?.name || alert.location}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(alert.verified)}>
                          {alert.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <Clock className="h-4 w-4" />
                          {alert.createdAt ? new Date(alert.createdAt).toLocaleString("en-IN") : alert.timestamp}
                        </div>
                        {/* AI Scores */}
                        {(alert.probabilityScore !== undefined || alert.trustScore !== undefined) && (
                          <div className="flex gap-3 text-xs">
                            <span className="text-blue-300">
                              AI: <span className="text-white font-bold">{alert.probabilityScore?.toFixed(1) || "—"}/10</span>
                            </span>
                            <span className="text-blue-300">
                              Trust: <span className="font-bold" style={{
                                color: (alert.trustScore || 0) >= 8 ? "#ef4444" : (alert.trustScore || 0) >= 5 ? "#f97316" : "#eab308"
                              }}>{alert.trustScore?.toFixed(1) || "—"}/10</span>
                            </span>
                            {alert.socialPostCount > 0 && (
                              <span className="text-purple-300">{alert.socialPostCount} social posts</span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-gray-300 line-clamp-2">{alert.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alert Details */}
              <div>
                {selectedAlert ? (
                  <Card
                    ref={detailRef}
                    className="bg-slate-800/50 border-blue-800/30"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-white">
                          {selectedAlert.hazardType} &bull; {selectedAlert.severity}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => verifyAlert(selectedAlert.id)}
                            disabled={selectedAlert.verified}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {selectedAlert.verified ? "Verified" : "Verify"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                            onClick={() => dismissAlert(selectedAlert.id)}
                          >
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-300 bg-transparent"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Deploy Team
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-blue-200">Severity</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className={`w-3 h-3 rounded-full ${getSeverityColor(
                                selectedAlert.severity
                              )}`}
                            ></div>
                            <span className="text-white capitalize">
                              {selectedAlert.severity}
                            </span>
                          </div>
                          <CardDescription className="text-blue-200">
                            Reported at{" "}
                            {selectedAlert?.createdAt
                              ? new Date(
                                  selectedAlert.createdAt
                                ).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </CardDescription>
                        </div>
                        <div>
                          <Label className="text-blue-200">Source</Label>
                          <p className="text-white mt-1">
                            {selectedAlert.source}
                          </p>
                        </div>
                        <div>
                          <Label className="text-blue-200">Location</Label>
                          <p className="text-white mt-1">
                            {selectedAlert.location.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-blue-200">Coordinates</Label>
                          <p className="text-white mt-1">
                            {selectedAlert.location.lat},{" "}
                            {selectedAlert.location.lng}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-blue-200">Description</Label>
                        <p className="text-white mt-1">
                          {selectedAlert.description}
                        </p>
                      </div>

                      <div>
                        <Label className="text-blue-200">Contact Name</Label>
                        <p className="text-white mt-1">
                          {selectedAlert.reportedBy ||
                            selectedAlert.contactName ||
                            "N/A"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-blue-200">Contact Phone</Label>
                        <p className="text-white mt-1">
                          {selectedAlert.contactPhone || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-slate-800/50 border-blue-800/30">
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-blue-200">
                          Select an alert to view details
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Response Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Response Teams
              </h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                Add New Team
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className="bg-slate-800/50 border-blue-800/30"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{team.name}</CardTitle>
                      <Badge className={getTeamStatusColor(team.status)}>
                        {team.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-blue-200 capitalize">
                      {team.type.replace("-", " ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-blue-200">
                      <MapPin className="h-4 w-4" />
                      {team.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-200">
                      <Phone className="h-4 w-4" />
                      {team.contact}
                    </div>
                    <div>
                      <Label className="text-blue-200 text-xs">
                        Specializations
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {team.specialization.map((spec) => (
                          <Badge
                            key={spec}
                            variant="outline"
                            className="border-blue-600 text-blue-300 text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Deploy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-300 bg-transparent"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Emergency Broadcast Tab */}
          <TabsContent value="broadcast" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white">
                    Emergency Broadcast
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Send alerts to affected populations via multiple channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-blue-200">Alert Type</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-blue-800/30">
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tsunami">Tsunami Warning</SelectItem>
                        <SelectItem value="cyclone">Cyclone Alert</SelectItem>
                        <SelectItem value="flood">Flood Warning</SelectItem>
                        <SelectItem value="evacuation">
                          Evacuation Order
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-blue-200">Target Areas</Label>
                    <Input
                      placeholder="Enter affected areas (comma separated)"
                      className="bg-slate-700 border-blue-800/30"
                    />
                  </div>

                  <div>
                    <Label className="text-blue-200">Message</Label>
                    <Textarea
                      placeholder="Enter emergency message..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="bg-slate-700 border-blue-800/30 min-h-32"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-200">Broadcast Channels</Label>
                    <div className="space-y-2">
                      {[
                        { id: "sms", label: "SMS Alerts", icon: Phone },
                        {
                          id: "email",
                          label: "Email Notifications",
                          icon: Mail,
                        },
                        { id: "radio", label: "Emergency Radio", icon: Zap },
                        { id: "social", label: "Social Media", icon: Globe },
                      ].map(({ id, label, icon: Icon }) => (
                        <div key={id} className="flex items-center space-x-2">
                          <Switch id={id} />
                          <Icon className="h-4 w-4 text-blue-400" />
                          <Label htmlFor={id} className="text-white">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Emergency Broadcast
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white">
                    Recent Broadcasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        time: "14:30",
                        type: "Tsunami Warning",
                        area: "Chennai Coast",
                        status: "Delivered",
                      },
                      {
                        time: "12:15",
                        type: "Cyclone Alert",
                        area: "Odisha Coast",
                        status: "Sending",
                      },
                    ].map((broadcast, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {broadcast.type}
                          </p>
                          <p className="text-blue-200 text-sm">
                            {broadcast.area} • {broadcast.time}
                          </p>
                        </div>
                        <Badge
                          className={
                            broadcast.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {broadcast.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Active Alerts",
                  value: "12",
                  change: "+3",
                  icon: AlertTriangle,
                  color: "text-red-400",
                },
                {
                  title: "Teams Deployed",
                  value: "8",
                  change: "+2",
                  icon: Users,
                  color: "text-blue-400",
                },
                {
                  title: "People Evacuated",
                  value: "15,420",
                  change: "+1,200",
                  icon: Shield,
                  color: "text-green-400",
                },
                {
                  title: "Response Time",
                  value: "12 min",
                  change: "-2 min",
                  icon: Clock,
                  color: "text-purple-400",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-blue-800/30"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                        <p className={`text-sm ${stat.color}`}>
                          {stat.change} from last hour
                        </p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white">
                    Alert Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Tsunami", count: 5, color: "bg-red-500" },
                      { type: "Cyclone", count: 3, color: "bg-orange-500" },
                      { type: "Flood", count: 2, color: "bg-blue-500" },
                      { type: "Storm Surge", count: 2, color: "bg-purple-500" },
                    ].map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          ></div>
                          <span className="text-white">{item.type}</span>
                        </div>
                        <span className="text-blue-200">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        system: "Seismic Monitoring",
                        status: "Online",
                        uptime: "99.9%",
                      },
                      {
                        system: "Weather Stations",
                        status: "Online",
                        uptime: "98.7%",
                      },
                      {
                        system: "Satellite Feed",
                        status: "Online",
                        uptime: "99.2%",
                      },
                      {
                        system: "Communication Network",
                        status: "Online",
                        uptime: "99.8%",
                      },
                    ].map((system) => (
                      <div
                        key={system.system}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white">{system.system}</p>
                          <p className="text-blue-200 text-sm">
                            Uptime: {system.uptime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm">
                            {system.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
