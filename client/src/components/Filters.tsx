import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GameFilters } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

interface FiltersProps {
  onFilterChange: (filters: GameFilters) => void;
  categories: string[];
  currentFilters: GameFilters;
}

export function Filters({
  onFilterChange,
  categories,
  currentFilters,
}: FiltersProps) {
  const handleSortChange = (value: string) => {
    onFilterChange({ ...currentFilters, sort: value as any });
  };

  const handleCategoryChange = (category: string) => {
    const newCategory =
      currentFilters.category === category ? undefined : category;
    onFilterChange({ ...currentFilters, category: newCategory });
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onFilterChange({
      ...currentFilters,
      [type === "min" ? "minPrice" : "maxPrice"]: numValue,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground">
          Filtros Ativos
        </h3>
        {(currentFilters.category ||
          currentFilters.minPrice ||
          currentFilters.maxPrice ||
          currentFilters.sort) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-0 text-xs hover:bg-transparent text-destructive"
          >
            Limpar <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ordenar por</Label>
        <Select
          value={currentFilters.sort || "az"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a ordem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="az">A - Z (Nome)</SelectItem>
            <SelectItem value="za">Z - A (Nome)</SelectItem>
            <SelectItem value="price_asc">Menor Preço</SelectItem>
            <SelectItem value="price_desc">Maior Preço</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium text-base">Categorias</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Button
                    variant={
                      currentFilters.category === category
                        ? "secondary"
                        : "ghost"
                    }
                    className={`w-full justify-start h-8 px-2 font-normal ${
                      currentFilters.category === category
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-4 pt-4 border-t">
        <Label>Faixa de Preço</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="min-price"
              className="text-xs text-muted-foreground"
            >
              Mínimo
            </Label>
            <div className="relative">
              <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">
                R$
              </span>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                className="pl-6 h-9"
                value={currentFilters.minPrice || ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="max-price"
              className="text-xs text-muted-foreground"
            >
              Máximo
            </Label>
            <div className="relative">
              <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">
                R$
              </span>
              <Input
                id="max-price"
                type="number"
                placeholder="Max"
                className="pl-6 h-9"
                value={currentFilters.maxPrice || ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
