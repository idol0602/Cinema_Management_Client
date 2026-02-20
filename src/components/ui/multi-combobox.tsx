"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  value: string;
  label: string;
}

interface MultiComboboxProps {
  datas: Data[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiCombobox({
  datas,
  values,
  onChange,
  placeholder = "Chọn...",
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabels = values
    .map((v) => datas.find((d) => d.value === v)?.label)
    .filter(Boolean);

  const toggleValue = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          <span className="truncate">
            {selectedLabels.length > 0
              ? selectedLabels.length === 1
                ? selectedLabels[0]
                : `${selectedLabels.length} đã chọn`
              : placeholder}
          </span>
          <div className="flex items-center gap-1 ml-1">
            {values.length > 0 && (
              <X
                className="h-3 w-3 opacity-50 hover:opacity-100 shrink-0"
                onClick={clearAll}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>

            <CommandGroup>
              {datas.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => toggleValue(item.value)}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      values.includes(item.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>

      {/* Show selected badges below */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {values.map((val) => {
            const item = datas.find((d) => d.value === val);
            if (!item) return null;
            return (
              <Badge
                key={val}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => toggleValue(val)}
              >
                {item.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
    </Popover>
  );
}
