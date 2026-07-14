"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Waves, Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("citizen")
  const router = useRouter()

  // const handleLogin = async (e: React.FormEvent, userType: string) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   // Simulate authentication
  //   setTimeout(() => {
  //     setIsLoading(false)
  //     if (userType === "admin") {
  //       router.push("/admin")
  //     } else {
  //       router.push("/dashboard")
  //     }
  //   }, 2000)
  // }
  // 
  const handleLogin = async (e: React.FormEvent, userType: string) => {
    e.preventDefault();
    setIsLoading(true);
  
    const email = (document.getElementById(
      userType === "admin" ? "adminEmail" : "email"
    ) as HTMLInputElement).value;
    const password = (document.getElementById(
      userType === "admin" ? "adminPassword" : "password"
    ) as HTMLInputElement).value;
  
    let body: any = { email, password };
  
    // if admin, also send the security code
    if (userType === "admin") {
      const adminCode = (document.getElementById("adminCode") as HTMLInputElement).value;
      body.adminCode = adminCode;
    }
  
    try {
      const res = await fetch(
        userType === "admin" ? "/api/auth/admin-signin" : "/api/auth/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || "Login failed");
  
      localStorage.setItem("token", data.token);
  
      if (userType === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // const handleSignup = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   // Simulate registration
  //   setTimeout(() => {
  //     setIsLoading(false)
  //     router.push("/dashboard")
  //   }, 2000)
  // }
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
    const email = (document.getElementById("signupEmail") as HTMLInputElement).value;
    const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || "Signup failed");
  
      alert("Account created successfully! Please log in.");
  
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)] flex items-center justify-center p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-ocean-foam)] rounded-full blur-xl wave-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[var(--color-accent)] rounded-full blur-lg float-animation"></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-[var(--color-ocean-light)] rounded-full blur-2xl wave-animation"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">OceanGuard India</h1>
          <p className="text-white/70">Secure access to ocean hazard monitoring</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
              <TabsTrigger
                value="citizen"
                className="data-[state=active]:bg-[var(--color-accent)] data-[state=active]:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Citizen Login
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-[var(--color-accent)] data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="citizen" className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Citizen Access</h2>
                <p className="text-white/60 text-sm">Report hazards and access community data</p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={(e) => handleLogin(e, "citizen")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center text-white/70">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                      </label>
                      <Link href="/auth/forgot-password" className="text-[var(--color-accent)] hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-white">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" id="terms" className="mt-1" required />
                      <label htmlFor="terms" className="text-white/70 text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[var(--color-accent)] hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center">
                <p className="text-white/60 text-sm mb-4">Or continue with</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Administrator Access</h2>
                <p className="text-white/60 text-sm">Emergency response and system management</p>
              </div>

              <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-white">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@oceanguard.gov.in"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-white">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                    <Input
                      id="adminPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminCode" className="text-white">
                    Security Code
                  </Label>
                  <Input
                    id="adminCode"
                    type="text"
                    placeholder="Enter 6-digit security code"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Admin access requires additional verification. Contact your system administrator if you need
                    assistance.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--color-coral-accent)] hover:bg-[var(--color-coral-accent)]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Admin Sign In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Anonymous Reporting Option */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm mb-3">Need to report an emergency quickly?</p>
          <Link href="/report/anonymous">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Anonymous Emergency Report
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-xs">
            Powered by INCOIS & Government of India
            <br />
            <Link href="/" className="text-[var(--color-accent)] hover:underline">
              Back to Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
