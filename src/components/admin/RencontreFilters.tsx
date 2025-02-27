
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RencontreFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const RencontreFilters = ({
  statusFilter,
  onStatusChange,
}: RencontreFiltersProps) => {
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
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RencontreFilters;
