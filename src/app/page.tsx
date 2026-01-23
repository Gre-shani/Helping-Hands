import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Helping Hands</div>
          <nav className="flex space-x-6">
            <a href="#home" className="hover:text-primary">Home</a>
            <a href="#about" className="hover:text-primary">About</a>
            <a href="#how-it-works" className="hover:text-primary">How It Works</a>
            <Link href="/login" className="hover:text-primary">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Helping Hands: Connecting Communities for Good
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A comprehensive platform for donation management, volunteer coordination, and delivery logistics
          to support children's homes and community needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Donate Goods</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Offer Services</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Volunteer for Delivery</Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Helping Hands</h2>
          <p className="text-lg text-muted-foreground">
            Helping Hands is a verified platform dedicated to connecting children's homes with donors, service providers,
            and delivery volunteers. We ensure trust, transparency, and safety in every interaction, focusing on goods
            donations, services, and delivery coordination without any financial transactions.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Donation Management</CardTitle>
              <CardDescription>Streamlined donation requests and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Children's homes can easily request specific needs, and donors can contribute directly.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Coordination</CardTitle>
              <CardDescription>Efficient volunteer matching and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Connect volunteers with opportunities based on skills and availability.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logistics</CardTitle>
              <CardDescription>Optimized delivery routes and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coordinate pickup and delivery of donations with real-time tracking.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Impact Tracking</CardTitle>
              <CardDescription>Monitor and report on community impact</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track donations, volunteer hours, and measure positive outcomes.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mb-4 mx-auto">1</div>
            <h3 className="text-xl font-semibold mb-2">Request or Donate</h3>
            <p>Children's homes submit needs, donors contribute items or funds.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mb-4 mx-auto">2</div>
            <h3 className="text-xl font-semibold mb-2">Coordinate</h3>
            <p>Volunteers and delivery partners organize pickup and distribution.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mb-4 mx-auto">3</div>
            <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
            <p>Monitor deliveries and volunteer efforts for maximum community benefit.</p>
          </div>
        </div>
      </section>

      {/* Featured Requests Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>School Supplies</CardTitle>
              <CardDescription>Bright Future Home</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Need notebooks, pencils, and backpacks for 50 children.</p>
              <Link href="/login">
                <Button className="mt-4" size="sm">Donate</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medical Supplies</CardTitle>
              <CardDescription>Hope Center</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bandages, antiseptics, and first aid kits required.</p>
              <Link href="/login">
                <Button className="mt-4" size="sm">Offer Services</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clothing</CardTitle>
              <CardDescription>Sunshine Orphanage</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Winter clothing for children aged 5-12.</p>
              <Link href="/login">
                <Button className="mt-4" size="sm">Volunteer Delivery</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}