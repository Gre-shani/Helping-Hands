"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [location, setLocation] = useState("")
  const [role, setRole] = useState("")
  const [services, setServices] = useState("")
  const [qualifications, setQualifications] = useState<File | null>(null)
  const [verificationDocument, setVerificationDocument] = useState<File | null>(null)

  const handleSignup = () => {
    // Mock signup - in real app, this would call an API
    if (name && email && password && confirmPassword && location && role) {
      if (password !== confirmPassword) {
        alert("Passwords do not match.")
        return
      }
      if (role === "Service Provider" && !services) {
        alert("Please specify services offered.")
        return
      }
      alert("Signup successful! Please wait for admin approval.")
      window.location.href = "/login"
    } else {
      alert("Please fill in all required fields.")
    }
  }

  const requiresDocument = role === "Children's Home" || role === "Service Provider" || role === "Delivery Volunteer"

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up for Helping Hands</CardTitle>
          <CardDescription>Create your account to join the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Donor">Donor</SelectItem>
                <SelectItem value="Children's Home">Children's Home</SelectItem>
                <SelectItem value="Service Provider">Service Provider</SelectItem>
                <SelectItem value="Delivery Volunteer">Delivery Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === "Service Provider" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="services">Services Offered</Label>
                <Input
                  id="services"
                  placeholder="e.g., Medical checkups, counseling, tutoring"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualification Documents</Label>
                <Input
                  id="qualifications"
                  type="file"
                  multiple
                  onChange={(e) => setQualifications(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-muted-foreground">Upload certificates, licenses, or other qualification documents</p>
              </div>
            </>
          )}
          {(role === "Children's Home" || role === "Service Provider" || role === "Delivery Volunteer") && (
            <div className="space-y-2">
              <Label htmlFor="document">
                Document Upload
                {role === "Children's Home" && " (Registration Proof - Mandatory)"}
                {role === "Service Provider" && " (Police Clearance if interacting with children)"}
                {role === "Delivery Volunteer" && " (ID Verification - Optional)"}
              </Label>
              <Input
                id="document"
                type="file"
                onChange={(e) => setVerificationDocument(e.target.files?.[0] || null)}
              />
            </div>
          )}
          <Button onClick={handleSignup} className="w-full">
            Sign Up
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}