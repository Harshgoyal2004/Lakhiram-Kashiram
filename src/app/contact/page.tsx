
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Navigation, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { ContactFormPayload } from '@/lib/types';

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload: ContactFormPayload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/submit-contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Contact form submission failed. Status:", response.status, "Result:", result);
        throw new Error(result.error || result.details || `Failed to send message. Status: ${response.status}`);
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Error submitting contact form client-side:", error);
      toast({
        title: "Error Sending Message",
        description: error.message || "An unexpected error occurred. Please try again or check the console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const address = "510-511, Lahori Gate, Khari Baoli, New Delhi, India - 110006";
  const googleMapsUrl = "https://www.google.com/maps/place/Lakhiram+Kashiram/@28.6569138,77.2164171,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfd12ea988a99:0x4de55569476eec4c!8m2!3d28.6569091!4d77.2189974!16s%2Fg%2F12hqn7ggn?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D";


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
                    <Input id="name" name="name" type="text" placeholder="Your Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" type="text" placeholder="Reason for contacting" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Write your message here..." rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Message"}
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
              <p className="text-muted-foreground">+91 9818425578</p>
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
