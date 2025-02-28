
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, BookOpen, Users, LucideIcon } from 'lucide-react';

interface InitiativeCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  count: number;
}

const InitiativeCard = ({ 
  title, 
  description, 
  icon, 
  href,
  count 
}: InitiativeCardProps) => {
  // Mapper les noms d'icônes aux composants d'icônes
  const IconComponent = () => {
    switch (icon) {
      case 'FileText':
        return <FileText className="text-assembly-blue h-6 w-6" />;
      case 'MessageSquare':
        return <MessageSquare className="text-assembly-blue h-6 w-6" />;
      case 'BookOpen':
        return <BookOpen className="text-assembly-blue h-6 w-6" />;
      case 'Users':
        return <Users className="text-assembly-blue h-6 w-6" />;
      default:
        return <FileText className="text-assembly-blue h-6 w-6" />;
    }
  };

  return (
    <div className="card-official p-6">
      <div className="flex items-start">
        <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
          <IconComponent />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-assembly-blue mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-assembly-blue">{count}</span>
              <span className="text-sm text-gray-500">initiatives</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue hover:text-white"
            asChild
          >
            <Link to={href}>
              Voir en détail
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InitiativeCard;
