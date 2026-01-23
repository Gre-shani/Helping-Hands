"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dummy data
const suggestedRequests = [
  { id: 1, item: "School Supplies", home: "Bright Future Home", status: "Posted" },
  { id: 2, item: "Clothing", home: "Hope Center", status: "Partially Fulfilled" },
  { id: 3, item: "Books", home: "Sunshine Orphanage", status: "Posted" },
]

const acceptedContributions = [
  { id: 1, item: "Food Items", home: "Bright Future Home", status: "In Delivery", deliveryDate: "2026-01-25" },
  { id: 2, item: "Toys", home: "Hope Center", status: "Delivered", deliveryDate: "2026-01-20" },
]

const roleConfigs = {
  admin: {
    title: "Admin Dashboard",
    description: "Manage users, monitor platform activity, and oversee operations.",
    sidebarItems: ["User Management", "Platform Analytics", "Donation Oversight", "Volunteer Coordination", "Delivery Monitoring"],
    mainContent: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Children's Home</TableCell>
                  <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  <TableCell><Button size="sm">Approve</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>Service Provider</TableCell>
                  <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  <TableCell><Button size="sm">Approve</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  },
  donor: {
    title: "Donor Dashboard",
    description: "Track your donations, view impact, and discover new giving opportunities.",
    sidebarItems: ["Profile", "Add Items", "Suggested Requests", "All Requests", "Accepted Contributions", "Delivery Status", "Reputation"],
    mainContent: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
            <CardDescription>List items you can donate. Be specific about the item details to help match with requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" placeholder="e.g., Elementary School Backpack" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="e.g., 10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="lightly-used">Lightly Used</SelectItem>
                    <SelectItem value="well-used">Well Used</SelectItem>
                    <SelectItem value="needs-repair">Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="school-supplies">School Supplies</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="e.g., Blue canvas backpack with compartments, suitable for ages 6-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemImage">Item Image (Optional)</Label>
              <Input id="itemImage" type="file" accept="image/*" />
            </div>
            <Button>Add Item</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suggested Requests</CardTitle>
            <CardDescription>Requests matching your listed items</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Children's Home</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.item}</TableCell>
                    <TableCell>{request.home}</TableCell>
                    <TableCell><Badge variant={request.status === "Posted" ? "default" : "secondary"}>{request.status}</Badge></TableCell>
                    <TableCell><Button size="sm">Contribute</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accepted Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Children's Home</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptedContributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell>{contribution.item}</TableCell>
                    <TableCell>{contribution.home}</TableCell>
                    <TableCell><Badge variant={contribution.status === "Delivered" ? "default" : "secondary"}>{contribution.status}</Badge></TableCell>
                    <TableCell>{contribution.deliveryDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  },
  "children's-home": {
    title: "Children's Home Dashboard",
    description: "Manage donation requests, coordinate with donors and volunteers.",
    sidebarItems: ["Post Request", "Track Fulfillment", "View Responses", "Delivery Tracking", "Feedback", "History"],
    mainContent: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post New Request</CardTitle>
            <CardDescription>Submit a detailed request for items or services needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestType">Request Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goods">Goods</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item/Service Name</Label>
                <Input id="itemName" placeholder="e.g., Winter jackets for children" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Needed</Label>
                <Input id="quantity" type="number" placeholder="e.g., 25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Input id="description" placeholder="Provide specific details: size, age group, condition requirements, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Input id="additionalInfo" placeholder="Any special requirements or notes" />
            </div>
            <Button>Submit Request</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contributors</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>School Supplies</TableCell>
                  <TableCell><Badge variant="secondary">Partially Fulfilled</Badge></TableCell>
                  <TableCell>2 donors</TableCell>
                  <TableCell><Button size="sm">View Details</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Clothing</TableCell>
                  <TableCell><Badge variant="outline">Posted</Badge></TableCell>
                  <TableCell>0 donors</TableCell>
                  <TableCell><Button size="sm">Edit</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  },
  "service-provider": {
    title: "Service Provider Dashboard",
    description: "Offer services, manage partnerships, and coordinate deliveries.",
    sidebarItems: ["Skills/Services", "Suggested Requests", "Accepted Services", "Notifications", "Reputation"],
    mainContent: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Suggested Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Children's Home</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Medical Checkup</TableCell>
                  <TableCell>Bright Future Home</TableCell>
                  <TableCell><Badge variant="outline">Posted</Badge></TableCell>
                  <TableCell><Button size="sm">Accept</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Counseling</TableCell>
                  <TableCell>Hope Center</TableCell>
                  <TableCell><Badge variant="outline">Posted</Badge></TableCell>
                  <TableCell><Button size="sm">Accept</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  },
  "delivery-volunteer": {
    title: "Delivery Volunteer Dashboard",
    description: "Manage your delivery routes, track packages, and coordinate pickups.",
    sidebarItems: ["Available Tasks", "Accepted Deliveries", "Route Planning", "Status Updates", "History"],
    mainContent: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nearby Delivery Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>School Supplies to Bright Future Home</TableCell>
                  <TableCell>2.5 km</TableCell>
                  <TableCell><Badge variant="outline">Available</Badge></TableCell>
                  <TableCell><Button size="sm">Accept</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Clothing to Hope Center</TableCell>
                  <TableCell>1.8 km</TableCell>
                  <TableCell><Badge variant="outline">Available</Badge></TableCell>
                  <TableCell><Button size="sm">Accept</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default function DashboardPage() {
  const params = useParams()
  const role = params.role as string
  const config = roleConfigs[role as keyof typeof roleConfigs]

  if (!config) {
    return <div>Invalid role</div>
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-muted/50 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">{config.title}</h2>
        <nav className="space-y-2">
          {config.sidebarItems.map((item, index) => (
            <div key={index} className="p-2 hover:bg-muted rounded cursor-pointer">
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-8">
          <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full">
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
        <p className="text-muted-foreground mb-6">{config.description}</p>
        {config.mainContent}
      </div>
    </div>
  )
}