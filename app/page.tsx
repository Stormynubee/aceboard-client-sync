import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Share2, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl">
            Video Reviews, <span className="text-primary">Synced</span> and Simplified.
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
            Share timestamped review links with clients. Collect precise feedback directly on the timeline. No more messy email chains.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="px-8 font-semibold">Start Free Trial</Button>
            </Link>
            <Link href="/review/demo">
              <Button size="lg" variant="outline" className="px-8 font-semibold">Watch Demo</Button>
            </Link>
          </div>
          <div className="mt-16 w-full max-w-5xl aspect-video bg-muted rounded-xl border shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Video className="w-12 h-12" />
              <p>Platform Preview Video</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for Professional Editors</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to get client approval faster.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background border-none shadow-md">
                <CardHeader>
                  <Clock className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Timestamped Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Clients can leave feedback at specific frames. No more "the red thing at 1:12".
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-md">
                <CardHeader>
                  <Share2 className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Instant Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generate secure, password-protected links for your clients in one click.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-md">
                <CardHeader>
                  <CheckCircle className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track status of every frame and get final sign-off directly on the video.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to sync your workflow?</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of editors who have cut their review cycles in half.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <Button size="lg" className="px-12 font-bold text-lg">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 AceBoard Client Sync. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
