
import React from "react";
import SEO from "@/components/seo/SEO";
import { useNavigate } from "react-router-dom";
import Hero from "../components/home/Hero";
import LatestProjects from "../components/home/LatestProjects";

import { ArrowRight, CheckCircle, Users, Map, Award, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate('/register');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <SEO title="SIZU — Social Impact Zone Uganda" description="Connect with impact-driven organizations across Uganda. Discover projects, partners, and events shaping sustainable development." path="/" />
      <Navbar />
      <main>
        <LatestProjects />
        <Hero />

        
        <CTASection onRegister={handleRegisterClick} />
        
        <ImpactSection />
      </main>
      <Footer />
    </>
  );
};

const CTASection = ({ onRegister }: { onRegister: () => void }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section ref={ref} className={`py-16 bg-gradient-to-br from-gray-100 to-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Why Join SIZU?
            </h3>
            <ul className="space-y-4 flex-grow">
              <BenefitItem text="Showcase your projects to a wide audience" />
              <BenefitItem text="Connect with potential partners and funders" />
              <BenefitItem text="Track and communicate your impact effectively" />
              <BenefitItem text="Stay informed about sector initiatives and opportunities" />
              <BenefitItem text="Be part of Uganda's sustainable development journey" />
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-gray-700 mb-6 flex-grow">
              Register your organization and start sharing your impactful projects with
              communities and stakeholders across Uganda.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onRegister} 
                className="btn-primary inline-flex items-center cursor-pointer"
              >
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link 
                to="/projects" 
                className="btn-secondary inline-flex items-center"
              >
                Find Projects <Search className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const ImpactSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section ref={ref} className={`py-16 bg-sizu-black text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Impact at a Glance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <CheckCircle className="h-10 w-10 text-sizu-yellow" />, title: "500+", desc: "Projects to be Completed" },
            { icon: <Users className="h-10 w-10 text-sizu-yellow" />, title: "200+", desc: "Future Partner Organizations" },
            { icon: <Map className="h-10 w-10 text-sizu-yellow" />, title: "50+", desc: "Districts to be Reached" },
            { icon: <Award className="h-10 w-10 text-sizu-yellow" />, title: "1M+", desc: "Lives to be Impacted" },
          ].map((item, i) => (
            <div
              key={i}
              className={`text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/5 shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/about" className="btn-secondary">
            Learn About Us
          </Link>
        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-start space-x-3">
      <CheckCircle className="h-6 w-6 text-sizu-yellow flex-shrink-0 mt-0.5" />
      <span className="text-gray-700">{text}</span>
    </li>
  );
};

export default Index;
