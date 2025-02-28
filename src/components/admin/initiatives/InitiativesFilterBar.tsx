
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface InitiativesFilterBarProps {
  typeFilter: string;
  legislatureFilter: string;
  onTypeChange: (value: string) => void;
  onLegislatureChange: (value: string) => void;
  onAddNew: () => void;
  addButtonLabel: string;
}

const InitiativesFilterBar = ({
  typeFilter,
  legislatureFilter,
  onTypeChange,
  onLegislatureChange,
  onAddNew,
  addButtonLabel
}: InitiativesFilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <div className="flex flex-wrap gap-4">
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="question_ecrite">Questions écrites</SelectItem>
              <SelectItem value="question_orale">Questions orales</SelectItem>
              <SelectItem value="commission_enquete">Commissions d'enquête</SelectItem>
              <SelectItem value="proposition_loi">Propositions de loi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={legislatureFilter} onValueChange={onLegislatureChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par législature" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="15">15e Législature</SelectItem>
              <SelectItem value="14">14e Législature</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onAddNew}>
        <Plus className="mr-2 h-4 w-4" />
        {addButtonLabel}
      </Button>
    </div>
  );
};

export default InitiativesFilterBar;
