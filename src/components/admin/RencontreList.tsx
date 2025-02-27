
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
}

const RencontreList = ({ rencontres, onViewDetails }: RencontreListProps) => {
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
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      rencontre.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : rencontre.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {rencontre.status === "pending"
                      ? "En attente"
                      : rencontre.status === "approved"
                      ? "Approuvé"
                      : "Refusé"}
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
