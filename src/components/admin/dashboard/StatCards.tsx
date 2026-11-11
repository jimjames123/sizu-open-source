
import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Calendar,
  ArrowRight
} from "lucide-react";

interface StatsData {
  organizations: number;
  projects: number;
  events: number;
}

interface StatCardsProps {
  stats: StatsData;
  isLoading: boolean;
}

const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-gray-600">
            <Users className="mr-2 h-4 w-4 text-blue-600" />
            Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.organizations}</div>
          <Link to="/admin/organizations" className="text-sm text-blue-600 hover:underline inline-flex items-center mt-2">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-gray-600">
            <FileText className="mr-2 h-4 w-4 text-green-600" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.projects}</div>
          <Link to="/admin/projects" className="text-sm text-blue-600 hover:underline inline-flex items-center mt-2">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-purple-600" />
            Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.events}</div>
          <Link to="/admin/events" className="text-sm text-blue-600 hover:underline inline-flex items-center mt-2">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
