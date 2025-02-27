
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface QuestionDetailsModalProps {
  question: Question | null;
  onClose: () => void;
}

const QuestionDetailsModal = ({ question, onClose }: QuestionDetailsModalProps) => {
  return (
    <Dialog open={!!question} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{question?.title}</DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="font-semibold">Soumis par</p>
                <p>{question?.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{question?.email}</p>
              </div>
              <div>
                <p className="font-semibold">Catégorie</p>
                <p>{question?.category}</p>
              </div>
              <div>
                <p className="font-semibold">Date de soumission</p>
                <p>{question?.created_at && new Date(question.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="mt-2 whitespace-pre-wrap">{question?.description}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDetailsModal;
