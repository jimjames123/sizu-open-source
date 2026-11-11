
import React from "react";
import SEO from "@/components/seo/SEO";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const About = () => {
  return (
    <>
      <SEO title="About SIZU — Our Mission & Vision" description="Learn about Social Impact Zone Uganda — our mission to connect impact-driven organizations and accelerate sustainable development across Uganda." path="/about" />
      <Navbar />
      <main className="page-container pt-12 pb-20">
        {/* Red header section */}
        <div className="red-header text-center">
          <h1>What We Do</h1>
          <p className="mx-auto">
            We empower communities and drive sustainable development across Uganda through
            innovative collaborations and impactful projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              A Uganda where every community has access to resources, opportunities, and
              support needed to achieve sustainable development and improved quality of
              life.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To facilitate and strengthen collaboration between organizations, communities,
              and stakeholders to create sustainable social impact through innovative
              projects and initiatives across Uganda.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-sizu-red rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace creative solutions and new approaches to development challenges.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-sizu-yellow rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                We build partnerships and facilitate cooperation to achieve greater impact.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-sizu-black rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We uphold the highest standards of honesty, transparency, and accountability.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Our Impact Areas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-sizu-red pl-4">
              <h3 className="text-xl font-semibold mb-2">Sustainable Development</h3>
              <p className="text-gray-600">
                Promoting projects and initiatives that contribute to long-term economic growth,
                social inclusion, and environmental protection.
              </p>
            </div>
            
            <div className="border-l-4 border-sizu-yellow pl-4">
              <h3 className="text-xl font-semibold mb-2">Capacity Building</h3>
              <p className="text-gray-600">
                Strengthening the skills, abilities, and resources of organizations and communities
                to address development challenges effectively.
              </p>
            </div>
            
            <div className="border-l-4 border-sizu-black pl-4">
              <h3 className="text-xl font-semibold mb-2">Knowledge Sharing</h3>
              <p className="text-gray-600">
                Facilitating the exchange of best practices, lessons learned, and innovative
                approaches to maximize development impact.
              </p>
            </div>
            
            <div className="border-l-4 border-sizu-red pl-4">
              <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
              <p className="text-gray-600">
                Ensuring that local communities are actively involved in the planning,
                implementation, and evaluation of development initiatives.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
