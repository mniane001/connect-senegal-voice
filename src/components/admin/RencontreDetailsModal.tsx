
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface RencontreDetailsModalProps {
  rencontre: Rencontre | null;
  onClose: () => void;
}

const RencontreDetailsModal = ({ rencontre, onClose }: RencontreDetailsModalProps) => {
  return (
    <Dialog open={!!rencontre} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Demande de rencontre : {rencontre?.subject}</DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="font-semibold">Demandé par</p>
                <p>{rencontre?.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{rencontre?.email}</p>
              </div>
              {rencontre?.phone && (
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p>{rencontre.phone}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Date de la demande</p>
                <p>{rencontre?.created_at && new Date(rencontre.created_at).toLocaleDateString()}</p>
              </div>
              {rencontre?.meeting_date && (
                <div>
                  <p className="font-semibold">Date de rencontre proposée</p>
                  <p>{new Date(rencontre.meeting_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">Message</p>
              <p className="mt-2 whitespace-pre-wrap">{rencontre?.message}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RencontreDetailsModal;
