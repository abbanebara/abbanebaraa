"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  { value: "Adrar", label: "Adrar" },
  { value: "Chlef", label: "Chlef" },
  { value: "Laghouat", label: "Laghouat" },
  { value: "Oum El Bouaghi", label: "Oum El Bouaghi" },
  { value: "Batna", label: "Batna" },
  { value: "Béjaïa", label: "Bejaia" },
  { value: "Biskra", label: "Biskra" },
  { value: "Béchar", label: "Bechar" },
  { value: "Blida", label: "Blida" },
  { value: "Bouira", label: "Bouira" },
  { value: "Tamanrasset", label: "Tamanrasset" },
  { value: "Tébessa", label: "Tebessa" },
  { value: "Tlemcen", label: "Tlemcen" },
  { value: "Tiaret", label: "Tiaret" },
  { value: "Tizi Ouzou", label: "Tizi Ouzou" },
  { value: "Algiers", label: "Alger" },
  { value: "Djelfa", label: "Djelfa" },
  { value: "Jijel", label: "Jijel" },
  { value: "Sétif", label: "Setif" },
  { value: "Saïda", label: "Saida" },
  { value: "Skikda", label: "Skikda" },
  { value: "Sidi Bel Abbès", label: "Sidi Bel Abbes" },
  { value: "Annaba", label: "Annaba" },
  { value: "Guelma", label: "Guelma" },
  { value: "Constantine", label: "Constantine" },
  { value: "Médéa", label: "Medea" },
  { value: "Mostaganem", label: "Mostaganem" },
  { value: "M'Sila", label: "M'Sila" },
  { value: "Mascara", label: "Mascara" },
  { value: "Ouargla", label: "Ouargla" },
  { value: "Oran", label: "Oran" },
  { value: "El Bayadh", label: "El Bayadh" },
  { value: "Illizi", label: "Illizi" },
  { value: "Bordj Bou Arréridj", label: "Bordj Bou Arreridj" },
  { value: "Boumerdès", label: "Boumerdes" },
  { value: "El Tarf", label: "El Tarf" },
  { value: "Tindouf", label: "Tindouf" },
  { value: "Tissemsilt", label: "Tissemsilt" },
  { value: "El Oued", label: "El Oued" },
  { value: "Khenchela", label: "Khenchela" },
  { value: "Souk Ahras", label: "Souk Ahras" },
  { value: "Tipaza", label: "Tipaza" },
  { value: "Mila", label: "Mila" },
  { value: "Aïn Defla", label: "Ain Defla" },
  { value: "Naâma", label: "Naama" },
  { value: "Aïn Témouchent", label: "Ain Temouchent" },
  { value: "Ghardaïa", label: "Ghardaia" },
  { value: "Relizane", label: "Relizane" },
  { value: "Timimoun", label: "Timimoun" },
  { value: "Bordj Badji Mokhtar", label: "Bordj Badji Mokhtar" },
  { value: "Ouled Djellal", label: "Ouled Djellal" },
  { value: "Béni Abbès", label: "Beni Abbes" },
  { value: "In Salah", label: "In Salah" },
  { value: "In Guezzam", label: "In Guezzam" },
  { value: "Touggourt", label: "Touggourt" },
  { value: "Djanet", label: "Djanet" },
  { value: "El M'Ghair", label: "El M'Ghair" },
  { value: "El Menia", label: "El Menia" }
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[48px] w-[450px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select city..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search state..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
