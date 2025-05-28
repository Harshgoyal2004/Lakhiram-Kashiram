import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of cooking oils do you offer?",
    answer: "We offer a wide range of cooking oils including mustard oil, sesame oil, olive oil (extra virgin, virgin, pure), coconut oil, groundnut oil, sunflower oil, and various specialty oils. Each oil is carefully selected for its quality and purity."
  },
  {
    question: "Are your oils cold-pressed?",
    answer: "Many of our oils, such as our Pure Mustard Oil, Organic Sesame Oil, and Extra Virgin Olive Oil, are cold-pressed (Kachi Ghani) to retain their natural nutrients, flavor, and aroma. Please check the product description for specific extraction methods."
  },
  {
    question: "Do you offer organic oils?",
    answer: "Yes, we have a selection of certified organic oils. Look for the 'Organic' tag in the product details or use our filter options to find organic products."
  },
  {
    question: "What is the shelf life of your oils?",
    answer: "The shelf life varies by oil type and storage conditions. Generally, most oils last between 12 to 24 months from the manufacturing date. Please refer to the packaging for the 'Best Before' date and store oils in a cool, dark place away from direct sunlight."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can use this information to track your order's progress. You can also view your order status in the 'My Account' section if you have an account with us."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns for unopened products within 14 days of delivery if the product is damaged or incorrect. Please contact our customer service team with your order details to initiate a return. For more details, please refer to our [Return Policy Page Link - to be created]."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we primarily ship within India. For international shipping inquiries, please contact our customer support team, and we will do our best to assist you."
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products, orders, and services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
              <AccordionTrigger className="p-6 text-lg font-semibold text-left hover:text-brand-gold hover:no-underline focus:text-brand-gold focus:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 text-foreground/80 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-4">Can't find your answer?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Feel free to <a href="/contact" className="text-primary hover:underline">contact our support team</a> for further assistance.
        </p>
      </div>
    </div>
  );
}
