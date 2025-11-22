import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X } from 'lucide-react';
import { GameFilters } from '@shared/schema';

interface FiltersProps {
  onFilterChange: (filters: GameFilters) => void;
  categories: string[];
}

export function Filters({ onFilterChange, categories }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('500');

  useEffect(() => {
    const filters: GameFilters = {
      search: search || undefined,
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    onFilterChange(filters);
  }, [search, selectedCategories, priceRange]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(current =>
      current.includes(category)
        ? current.filter(c => c !== category)
        : [category]
    );
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    setMinPrice(values[0].toString());
    setMaxPrice(values[1].toString());
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    const num = parseFloat(value) || 0;
    setPriceRange([num, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    const num = parseFloat(value) || 500;
    setPriceRange([priceRange[0], num]);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setMinPrice('0');
    setMaxPrice('500');
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search" className="mb-2 block">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Nome do jogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold">Categorias</Label>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
                data-testid={`checkbox-category-${category}`}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold">Faixa de Preço</Label>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          className="mb-4"
          data-testid="slider-price"
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min-price" className="text-xs mb-1 block">Mínimo</Label>
            <Input
              id="min-price"
              type="number"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="h-8"
              data-testid="input-min-price"
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs mb-1 block">Máximo</Label>
            <Input
              id="max-price"
              type="number"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="h-8"
              data-testid="input-max-price"
            />
          </div>
        </div>
      </div>

      {(search || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
