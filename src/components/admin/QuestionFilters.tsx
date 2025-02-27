
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "education", label: "Éducation" },
  { value: "sante", label: "Santé" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "economie", label: "Économie" },
  { value: "environnement", label: "Environnement" },
  { value: "agriculture", label: "Agriculture" },
  { value: "securite", label: "Sécurité" },
  { value: "justice", label: "Justice" },
  { value: "culture", label: "Culture" },
  { value: "sport", label: "Sport" },
  { value: "transport", label: "Transport" },
  { value: "emploi", label: "Emploi" },
  { value: "autre", label: "Autre" }
];

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
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestionFilters;
