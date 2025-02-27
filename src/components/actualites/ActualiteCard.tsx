
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ActualiteCardProps {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  published_at: string | null;
}

const ActualiteCard = ({
  id,
  title,
  excerpt,
  content,
  image_url,
  category,
  published_at
}: ActualiteCardProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card-official bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image_url || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-assembly-blue text-white px-3 py-1 text-sm font-medium">
          {category}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="text-sm text-gray-500 mb-2">
          {formatDate(published_at)}
        </div>
        <h3 className="text-xl font-bold mb-3 text-assembly-blue line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {excerpt || content}
        </p>
        <Link
          to={`/actualites/${id}`}
          className="text-assembly-blue font-medium hover:underline self-start mt-auto flex items-center"
        >
          Lire la suite
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ActualiteCard;
