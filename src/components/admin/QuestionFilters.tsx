
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFiltersProps {
  statusFilter: string;
  categoryFilter: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const QuestionFilters = ({
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
}: QuestionFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Statut</SelectLabel>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="submitted">Soumis</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="completed">Complété</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Catégorie</SelectLabel>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="education">Éducation</SelectItem>
            <SelectItem value="sante">Santé</SelectItem>
            <SelectItem value="infrastructure">Infrastructure</SelectItem>
            <SelectItem value="economie">Économie</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestionFilters;
