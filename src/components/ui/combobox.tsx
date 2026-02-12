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

interface Data {
  value: string; // ID
  label: string; // text search
}

interface ComboboxProps {
  datas: Data[];
  value: string; // ID đang chọn
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({
  datas,
  value,
  onChange,
  placeholder = "Select",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = value
    ? datas.find((d) => d.value === value)?.label
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>

            <CommandGroup>
              {/* Tất cả */}
              <CommandItem
                key="all"
                value="Tất cả"
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                Tất cả
                <Check
                  className={cn(
                    "ml-auto",
                    value === "" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>

              {/* Data items */}
              {datas.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
