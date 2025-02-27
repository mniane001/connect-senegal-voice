
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Question {
  id: string;
  created_at: string;
  name: string;
  email: string;
  category: string;
  status: string;
  title: string;
  description: string;
}

interface QuestionListProps {
  questions: Question[];
  onViewDetails: (question: Question) => void;
  onStatusUpdate: (questionId: string, newStatus: string) => void;
}

const QuestionList = ({ questions, onViewDetails, onStatusUpdate }: QuestionListProps) => {
  // Fonction utilitaire pour traduire le statut
  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Soumis";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Complété";
      default:
        return status;
    }
  };

  // Fonction utilitaire pour obtenir les classes CSS du badge de statut
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Questions écrites récentes</CardTitle>
        <CardDescription>
          Liste des questions écrites soumises par les citoyens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions?.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  {new Date(question.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{question.name}</TableCell>
                <TableCell>{question.category || "Non catégorisé"}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(question.status)}`}>
                    {getStatusText(question.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(question)}
                  >
                    Voir détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QuestionList;
