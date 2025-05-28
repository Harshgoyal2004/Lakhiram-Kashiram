
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., send email, save to DB)
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    (event.target as HTMLFormElement).reset();
  };

  const address = "510, Lahori Gate, Khari Baoli, New Delhi, India - 110006";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Get In Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our products, an order, or just want to share your feedback, please reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <section>
          <Card className="bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-brand-sienna">Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we will get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Your Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" type="text" placeholder="Reason for contacting" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Write your message here..." rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-serif font-semibold text-brand-sienna mb-6">Contact Information</h2>
          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <MapPin className="h-8 w-8 text-brand-gold mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Our Address</h3>
              <p className="text-muted-foreground">{address}</p>
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline mt-2 inline-flex items-center"
              >
                <Navigation className="mr-1 h-4 w-4" /> Get Directions
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <Phone className="h-8 w-8 text-brand-gold mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground">+91 9810176808</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <Mail className="h-8 w-8 text-brand-gold mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground">
                <a href="mailto:goyalvishal77@gmail.com" className="hover:text-primary">goyalvishal77@gmail.com</a>
              </p>
              <p className="text-muted-foreground">
                <a href="mailto:lakhiramkashiram@gmail.com" className="hover:text-primary">lakhiramkashiram@gmail.com</a>
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Customer service hours: Monday - Friday, 9:00 AM - 6:00 PM (IST)
          </p>
        </section>
      </div>
    </div>
  );
}
