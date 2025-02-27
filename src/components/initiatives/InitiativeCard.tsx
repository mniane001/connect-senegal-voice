
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface InitiativeItem {
  title: string;
  date: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

interface InitiativeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  items: InitiativeItem[];
  viewAllLink: string;
  viewAllText: string;
}

const InitiativeCard = ({ 
  title, 
  description, 
  icon: Icon, 
  items, 
  viewAllLink,
  viewAllText 
}: InitiativeCardProps) => {
  return (
    <div className="card-official p-6">
      <div className="flex items-start">
        <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
          <Icon className="text-assembly-blue h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-assembly-blue mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="border-l-4 border-assembly-blue p-4 bg-gray-50">
                <h3 className="font-bold text-assembly-blue">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.date}</span>
                  <Link to={item.linkUrl} className="text-assembly-blue hover:underline">
                    {item.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue hover:text-white"
            asChild
          >
            <Link to={viewAllLink}>
              {viewAllText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InitiativeCard;
