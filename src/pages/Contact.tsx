
import React, { useState } from "react";
import SEO from "@/components/seo/SEO";
import { Mail, Phone, Clock, MapPin, Send } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the send-contact-email edge function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to send your message");
      }
      
      if (data?.error) {
        console.error("Email service error:", data.error);
        throw new Error(data.error);
      }
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
        variant: "default"
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      
      let errorMessage = "There was a problem sending your message.";
      
      // Provide more specific error messages based on the error
      if (error.message?.includes("configuration")) {
        errorMessage = "The email service is not properly configured. Please try again later or contact us directly.";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: error.message || errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Contact SIZU — Get in Touch" description="Reach the SIZU team for partnerships, support, or questions about listing your organization or impact project on our platform." path="/contact" />
      <Navbar />
      <main className="page-container pb-20 pt-12">
        {/* Red header section */}
        <div className="red-header text-center">
          <h1>Contact Us</h1>
          <p className="mx-auto">Get in touch with us for any inquiries, partnerships, or support.</p>
        </div>

        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glass-panel rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-sizu-red text-white p-3 rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">NAKISUNGA - MUKONO, P.O BOX 152050</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-sizu-red text-white p-3 rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+256 767 937930 / +256 767 937931</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-sizu-red text-white p-3 rounded-full">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">sizunetlimited@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-sizu-red text-white p-3 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday | 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map (Placeholder for an actual map integration) */}
              <div className="rounded-xl overflow-hidden h-64 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">
                  Interactive Map Integration Will Be Placed Here
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    required
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    required
                    className="form-input"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    required
                    className="form-input"
                    placeholder="Enter message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    rows={5}
                    required
                    className="form-input resize-none"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="btn-accent w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
