
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, MessageSquareQuote, Loader2, ThumbsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { FeedbackFormPayload, StaticTestimonial } from '@/lib/types';
import { SITE_NAME } from '@/lib/constants';

const staticTestimonials: StaticTestimonial[] = [
  {
    id: 'testimonial-harsh-goyal',
    name: 'Harsh Goyal',
    location: 'Delhi',
    testimonial: `Absolutely outstanding quality and service from ${SITE_NAME}! Their products are consistently top-tier. Highly recommended.`,
    rating: 5,
    date: 'July 2024',
  },
  {
    id: 'testimonial-dhruv-goyal',
    name: 'Dhruv Goyal',
    location: 'Delhi',
    testimonial: `I'm extremely impressed with the purity and effectiveness of the oils. ${SITE_NAME} has become my go-to supplier.`,
    rating: 5,
    date: 'June 2024',
  },
  {
    id: 'testimonial-priya-sharma',
    name: 'Priya Sharma',
    location: 'Delhi',
    testimonial: `The team at ${SITE_NAME} is knowledgeable and always helpful. Their commitment to quality is evident in every product.`,
    rating: 5,
    date: 'May 2024',
  },
  {
    id: 'testimonial-amit-kumar',
    name: 'Amit Kumar',
    location: 'Delhi',
    testimonial: `I've been sourcing ingredients from ${SITE_NAME} for years for my business. Consistent quality and reliable delivery.`,
    rating: 5,
    date: 'April 2024',
  },
];

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState('');

  const handleRatingChange = (value: string) => {
    setRating(Number(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const payload: FeedbackFormPayload = {
      name,
      email: email || undefined,
      rating,
      message,
    };

    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || `Failed to submit feedback. Status: ${response.status}`);
      }

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for sharing your thoughts with us.",
      });
      // Reset form
      setName('');
      setEmail('');
      setRating(0);
      setMessage('');
      // Explicitly reset RadioGroup if it doesn't reset automatically
      const radioGroup = document.querySelector('form[aria-label="Feedback Form"] div[role="radiogroup"]');
      if (radioGroup) {
        const checkedRadio = radioGroup.querySelector('button[aria-checked="true"]') as HTMLButtonElement | null;
        if (checkedRadio) checkedRadio.click(); // This is a bit of a hack, ideally RadioGroup has a reset prop or controlled value works better
      }
    } catch (error: any) {
      console.error("Error submitting feedback form client-side:", error);
      toast({
        title: "Error Submitting Feedback",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Feedback & Reviews</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We value your opinion! Share your experience with ${SITE_NAME} or read what others are saying.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-serif font-semibold text-brand-sienna mb-10 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {staticTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card shadow-lg flex flex-col">
              <CardHeader>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                    />
                  ))}
                </div>
                <CardTitle className="text-xl font-serif text-brand-sienna">{testimonial.name}</CardTitle>
                {testimonial.location && <CardDescription>{testimonial.location} - {testimonial.date}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/80 leading-relaxed italic">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="bg-card shadow-xl max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-brand-sienna flex items-center">
              <MessageSquareQuote className="mr-3 h-8 w-8 text-brand-gold" /> Share Your Feedback
            </CardTitle>
            <CardDescription>Let us know about your experience or any suggestions you have.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Feedback Form">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <RadioGroup
                  onValueChange={handleRatingChange}
                  className="flex space-x-2 pt-1"
                  aria-label="Rating"
                  value={rating > 0 ? String(rating) : undefined}
                >
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <RadioGroupItem key={rate} value={String(rate)} id={`rating-${rate}`} className="sr-only" />
                  ))}
                   <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <Label htmlFor={`rating-${starValue}`} key={`label-star-${starValue}`}
                        className="cursor-pointer"
                        onClick={() => handleRatingChange(String(starValue))} // Ensure click on star label updates rating
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            rating >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30 hover:text-yellow-300'
                          }`}
                        />
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
                {rating === 0 && <p className="text-xs text-muted-foreground">Click a star to rate.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Feedback / Review</Label>
                <Textarea id="message" name="message" placeholder="Write your feedback here..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <> <ThumbsUp className="mr-2 h-5 w-5" /> Submit Feedback</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
