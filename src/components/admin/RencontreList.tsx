
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

interface Rencontre {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  meeting_date?: string;
}

interface RencontreListProps {
  rencontres: Rencontre[];
  onViewDetails: (rencontre: Rencontre) => void;
  onStatusUpdate: (rencontreId: string, newStatus: string) => void;
}

const RencontreList = ({ rencontres, onViewDetails, onStatusUpdate }: RencontreListProps) => {
  // Fonction utilitaire pour traduire le statut
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Refusé";
      default:
        return status;
    }
  };

  // Fonction utilitaire pour obtenir les classes CSS du badge de statut
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes de rencontre</CardTitle>
        <CardDescription>
          Liste des demandes de rencontre
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rencontres?.map((rencontre) => (
              <TableRow key={rencontre.id}>
                <TableCell>
                  {new Date(rencontre.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{rencontre.name}</TableCell>
                <TableCell>{rencontre.subject}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(rencontre.status)}`}>
                    {getStatusText(rencontre.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(rencontre)}
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

export default RencontreList;
