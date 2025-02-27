
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
}

const QuestionList = ({ questions, onViewDetails }: QuestionListProps) => {
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
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      question.status === "submitted"
                        ? "bg-yellow-100 text-yellow-800"
                        : question.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {question.status === "submitted"
                      ? "Soumis"
                      : question.status === "in_progress"
                      ? "En cours"
                      : "Complété"}
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
