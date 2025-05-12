import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ContactForm } from '@/components/shared';

export default function SupportPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground mt-2 text-md">
          Get help with your interview preparation journey
        </p>
      </div>

      <div className="mb-6 space-y-2">
        <h1 className="text-xl font-bold tracking-tight ">Documentation</h1>
        <p className="text-muted-foreground text-sm">
          Our documentation covers everything you need to know about using the
          platform effectively. From setting up your profile to preparing for
          specific interview types.
        </p>
        {/* Documentation links would go here */}
      </div>

      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <Accordion type="multiple" className="w-full text-muted-foreground">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How do I create a new interview preparation?
            </AccordionTrigger>
            <AccordionContent>
              Navigate to the Interviews section and click on &apos;New
              Interview&apos;. Follow the guided steps to set up your
              preparation session.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I download my interview reports?
            </AccordionTrigger>
            <AccordionContent>
              Yes, all interview reports can be downloaded in PDF format. Go to
              the Reports section and click the download icon next to any
              report.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              How do I update my account information?
            </AccordionTrigger>
            <AccordionContent>
              Account settings can be accessed by clicking on your profile
              picture in the top right corner and selecting
              &apos;Settings&apos;.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mb-6 space-y-2">
        <h1 className="text-xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground text-sm">
          Our support team is available to help with any questions or issues you
          may encounter. Fill out the form below and we&apos;ll get back to you
          as soon as possible.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
