import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Leaf, ShoppingCart, TrendingUp, Users, Zap, Shield, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NewLanding = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-leaf via-background to-surface-warm py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 field-lines opacity-20" aria-hidden="true" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-gentle-rise">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6">
                <Leaf className="size-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Connecting Farmers & Buyers in Ghana</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                Farm Fresh,
                <span className="block text-primary mt-2">Direct to You</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                The modern marketplace connecting farmers directly with buyers. 
                Fresh produce, fair prices, zero middlemen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button asChild size="lg" variant="farm" className="h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Link to="/login">
                    <ShoppingCart className="size-6" />
                    Start Buying
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 sm:h-16 text-base sm:text-lg font-semibold border-2 hover:bg-surface-leaf hover:border-primary transition-all">
                  <Link to="/login">
                    <Leaf className="size-6" />
                    Start Selling
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-2">500+</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">Active Farmers</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-2">1000+</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">Happy Buyers</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-2">5000+</div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">Transactions</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:ml-8">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <img 
                  src="/market.jpeg" 
                  alt="Farm Market" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30" />
                
                {/* Floating Cards */}
                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="absolute top-8 left-8 animate-leaf-sway">
                    <Card className="w-36 sm:w-44 shadow-xl backdrop-blur-sm bg-card/95 border-2">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl sm:text-5xl mb-2">🌽</div>
                        <div className="text-sm font-semibold">Fresh Maize</div>
                        <div className="text-sm text-primary font-bold mt-1">GH₵ 50/bag</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute top-1/4 right-8 animate-leaf-sway" style={{ animationDelay: "0.5s" }}>
                    <Card className="w-36 sm:w-44 shadow-xl backdrop-blur-sm bg-card/95 border-2">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl sm:text-5xl mb-2">🍚</div>
                        <div className="text-sm font-semibold">Premium Rice</div>
                        <div className="text-sm text-primary font-bold mt-1">GH₵ 120/bag</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute bottom-8 left-1/4 animate-leaf-sway" style={{ animationDelay: "1s" }}>
                    <Card className="w-36 sm:w-44 shadow-xl backdrop-blur-sm bg-card/95 border-2">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl sm:text-5xl mb-2">🥔</div>
                        <div className="text-sm font-semibold">Fresh Yam</div>
                        <div className="text-sm text-primary font-bold mt-1">GH₵ 80/tuber</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center Badge */}
                  <div className="bg-primary/95 backdrop-blur-sm text-primary-foreground rounded-2xl px-8 py-5 shadow-2xl border-2 border-primary">
                    <div className="text-5xl sm:text-6xl mb-2 text-center">👨🏾‍🌾</div>
                    <div className="text-base font-semibold text-center">Farm Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
              Why Choose Farm Market?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing how farmers and buyers connect, making fresh produce accessible to everyone.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="rounded-2xl border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Zap className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find and purchase fresh produce in seconds. Our streamlined platform makes buying effortless.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="rounded-2xl border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Shield className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Secure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your transactions are protected with bank-level security. Buy and sell with confidence.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="rounded-2xl border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Users className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Direct Connection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect directly with farmers. No middlemen, better prices for everyone.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="rounded-2xl border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <TrendingUp className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Fair Pricing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time market prices ensure farmers get fair value and buyers get competitive rates.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="rounded-2xl border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Smartphone className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Mobile First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Works perfectly on any device. Trade on the go with our mobile-optimized platform.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="rounded-2xl border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Globe className="size-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Works Offline</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access your listings even without internet. Perfect for rural areas with limited connectivity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-surface-leaf/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. Join thousands of farmers and buyers already using Farm Market.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* For Farmers */}
            <Card className="rounded-3xl border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">👨🏾‍🌾</div>
                <h3 className="text-2xl font-black mb-6">For Farmers</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Create Your Account</h4>
                      <p className="text-sm text-muted-foreground">Sign up in minutes with just your phone number and email.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">List Your Produce</h4>
                      <p className="text-sm text-muted-foreground">Add photos, set prices, and describe your fresh produce.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Connect with Buyers</h4>
                      <p className="text-sm text-muted-foreground">Buyers contact you directly via phone or WhatsApp.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Get Paid Fairly</h4>
                      <p className="text-sm text-muted-foreground">Negotiate directly and receive fair prices for your harvest.</p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="farm" size="lg" className="w-full mt-8">
                  <Link to="/create-account?role=farmer">
                    Start Selling Today
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* For Buyers */}
            <Card className="rounded-3xl border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-2xl font-black mb-6">For Buyers</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Browse Fresh Produce</h4>
                      <p className="text-sm text-muted-foreground">Explore listings from verified farmers in your area.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Compare Prices</h4>
                      <p className="text-sm text-muted-foreground">Check real-time market prices and find the best deals.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Contact Farmers</h4>
                      <p className="text-sm text-muted-foreground">Reach out directly via phone or WhatsApp to place orders.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Get Fresh Produce</h4>
                      <p className="text-sm text-muted-foreground">Arrange delivery or pickup and enjoy farm-fresh quality.</p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="harvest" size="lg" className="w-full mt-8">
                  <Link to="/create-account?role=buyer">
                    Start Buying Today
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
                Built for Ghana's Farmers
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We understand the unique challenges of farming in Ghana. That's why we built a platform that works for you.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="size-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">No Commission Fees</h4>
                    <p className="text-sm text-muted-foreground">Keep 100% of your earnings. We don't take a cut from your sales.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="size-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Works in Rural Areas</h4>
                    <p className="text-sm text-muted-foreground">Offline mode ensures you can manage listings even with poor connectivity.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="size-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Local Language Support</h4>
                    <p className="text-sm text-muted-foreground">Simple interface designed for ease of use, no technical skills needed.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="size-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Community Driven</h4>
                    <p className="text-sm text-muted-foreground">Join a growing community of farmers and buyers supporting each other.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <img 
                  src="/farmers.jpg" 
                  alt="Ghana Farmers" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-end p-8 text-center">
                  <div className="text-7xl sm:text-8xl mb-4">🌾</div>
                  <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">Empowering Farmers</p>
                  <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">One Connection at a Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              Join thousands of farmers and buyers already using Farm Market. 
              Create your free account today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" variant="secondary" className="h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/create-account?role=farmer">
                  <Leaf className="size-6" />
                  I'm a Farmer
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="h-14 text-lg font-bold bg-white text-primary border-2 border-white hover:bg-white/90 hover:text-primary shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/create-account?role=buyer">
                  <ShoppingCart className="size-6" />
                  I'm a Buyer
                </Link>
              </Button>
            </div>

            <p className="text-sm opacity-90">
              Already have an account?{" "}
              <Link to="/login" className="underline font-bold hover:opacity-100 transition-opacity">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-10 rounded-xl bg-surface-leaf flex items-center justify-center text-2xl">
                  🌾
                </div>
                <span className="font-black text-lg">Farm Market</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting farmers and buyers across Ghana.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Farmers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/create-account?role=farmer" className="hover:text-primary">Create Account</Link></li>
                <li><Link to="/prices" className="hover:text-primary">Market Prices</Link></li>
                <li><Link to="/login" className="hover:text-primary">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/create-account?role=buyer" className="hover:text-primary">Create Account</Link></li>
                <li><Link to="/buyer" className="hover:text-primary">Browse Produce</Link></li>
                <li><Link to="/login" className="hover:text-primary">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/settings" className="hover:text-primary">Settings</Link></li>
                <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
                <li><a href="tel:+233201234567" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Farm Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLanding;
