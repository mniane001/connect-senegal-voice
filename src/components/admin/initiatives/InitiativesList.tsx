
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Edit, Trash2, Eye } from "lucide-react";

export interface Initiative {
  id: string;
  title: string;
  type: string;
  legislature: string;
  status: string;
  created_at: string;
  published: boolean;
}

interface InitiativesListProps {
  initiatives: Initiative[];
  onView: (initiative: Initiative) => void;
  onEdit: (initiative: Initiative) => void;
  onDelete: (initiative: Initiative) => void;
}

const InitiativesList = ({ 
  initiatives, 
  onView, 
  onEdit, 
  onDelete 
}: InitiativesListProps) => {
  
  const getInitiativeTypeLabel = (type: string) => {
    switch(type) {
      case "question_ecrite": return "Question écrite";
      case "question_orale": return "Question orale";
      case "commission_enquete": return "Commission d'enquête";
      case "proposition_loi": return "Proposition de loi";
      default: return type;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "submitted": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "submitted": return "Soumis";
      case "in_progress": return "En cours";
      case "completed": return "Complété";
      case "approved": return "Approuvé";
      case "rejected": return "Rejeté";
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des initiatives parlementaires</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Législature</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Publié</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucune initiative trouvée
                </TableCell>
              </TableRow>
            ) : (
              initiatives.map((initiative) => (
                <TableRow key={initiative.id}>
                  <TableCell className="font-medium max-w-xs truncate" title={initiative.title}>
                    {initiative.title}
                  </TableCell>
                  <TableCell>{getInitiativeTypeLabel(initiative.type)}</TableCell>
                  <TableCell>{initiative.legislature}e Législature</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(initiative.status)}`}>
                      {getStatusLabel(initiative.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(initiative.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {initiative.published ? (
                      <span className="text-green-600">Oui</span>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onView(initiative)}
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(initiative)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(initiative)}
                        title="Supprimer"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InitiativesList;
