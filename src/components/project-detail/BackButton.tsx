
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  return (
    <div className="mb-6">
      <Link
        to="/projects"
        className="inline-flex items-center text-sizu-black hover:text-sizu-red transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Link>
    </div>
  );
};

export default BackButton;
