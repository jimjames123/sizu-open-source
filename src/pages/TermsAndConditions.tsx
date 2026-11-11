
import React from "react";
import SEO from "@/components/seo/SEO";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <SEO title="Terms and Conditions | SIZU" description="Read the terms and conditions for using the SIZU platform — Social Impact Zone Uganda." path="/terms" />
      <Navbar />
      <main className="page-container pb-20">
        <section className="max-w-4xl mx-auto">
          <h1 className="section-heading text-4xl md:text-5xl font-bold mb-8">
            Terms and Conditions
          </h1>
          <p className="text-gray-600 mb-6">
            Last updated: 17/03/2025
          </p>

          <div className="glass-panel rounded-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Social Impact Zone Uganda (SIZU). By accessing or using our platform, 
                you agree to be bound by these terms and conditions. Please read them carefully before proceeding.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">2.1. Account Creation:</span> Users must provide accurate and complete information when creating an account.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">2.2. Account Types:</span> We offer different account types for individuals and organizations.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">2.3. Account Security:</span> Users are responsible for maintaining the confidentiality of their account credentials.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">2.4. Account Termination:</span> We reserve the right to suspend or terminate accounts that violate our terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Project Submissions</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">3.1. Content Accuracy:</span> All submitted project information must be accurate and truthful.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">3.2. Approval Process:</span> Projects are subject to review and approval before publication.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">3.3. Project Updates:</span> Organizations must keep their project information up to date.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">3.4. Intellectual Property:</span> Users retain ownership of their content while granting us license to display it.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Fees and Payments</h2>
              <p className="text-gray-700">
                Please note that a service fee will be applicable for uploading projects and for the periodic publication of events on the platform. These charges contribute to maintaining platform quality, visibility, and sustainability. Specific fee amounts and payment schedules will be clearly communicated and may be subject to change with prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">5.1. Data Collection:</span> We collect and process personal data as outlined in our Privacy Policy.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">5.2. Data Security:</span> We implement reasonable security measures to protect user data.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">5.3. Third-Party Access:</span> We do not sell user data to third parties.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">5.4. Data Rights:</span> Users have rights regarding their personal data as per applicable laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Platform Usage</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">6.1. Acceptable Use:</span> Users must not use the platform for any illegal or unauthorized purpose.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">6.2. Content Guidelines:</span> Users must not post inappropriate, offensive, or harmful content.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">6.3. Service Availability:</span> We strive to maintain platform availability but do not guarantee uninterrupted service.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">6.4. Platform Changes:</span> We reserve the right to modify or discontinue services with reasonable notice.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Legal Compliance</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">7.1. Governing Law:</span> These terms are governed by Ugandan law.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">7.2. Dispute Resolution:</span> Any disputes will be resolved through mediation or Ugandan courts.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">7.3. Compliance:</span> Users must comply with all applicable laws and regulations.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">7.4. Changes to Terms:</span> We may update these terms with notice to users.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Liability and Disclaimers</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">8.1. Limitation of Liability:</span> We are not liable for indirect, consequential, or incidental damages.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">8.2. Project Verification:</span> While we review projects, we cannot guarantee their success or impact.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">8.3. User Interactions:</span> Users are responsible for their interactions with other users.
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">8.4. External Links:</span> We are not responsible for external websites linked on our platform.
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-sizu-red" />
                  <span>Email: sizunetlimited@gmail.com</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-sizu-yellow" />
                  <span>Phone: +256 767 937930</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sizu-black" />
                  <span>Address: NAKISUNGA - MUKONO, P.O BOX 152050</span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
