"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
}

interface CompanyAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCompany?: (company: Company) => void;
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  placeholder?: string;
  className?: string;
}

export function CompanyAutocomplete({
  value,
  onChange,
  onSelectCompany,
  companies,
  isLoading,
  error,
  placeholder = "Buscar empresa...",
  className,
}: CompanyAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectCompany = (company: Company) => {
    onChange(company.name);
    onSelectCompany?.(company);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < companies.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && companies[highlightedIndex]) {
          handleSelectCompany(companies[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (companies.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("pl-10", className)}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {error ? (
            <div className="px-3 py-2 text-sm text-red-600">{error}</div>
          ) : companies.length === 0 && value.length >= 2 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No se encontraron empresas
            </div>
          ) : (
            companies.map((company, index) => (
              <div
                key={company.id}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm flex items-center justify-between",
                  index === highlightedIndex
                    ? "bg-blue-50 text-blue-900"
                    : "hover:bg-gray-50"
                )}
                onClick={() => handleSelectCompany(company)}
              >
                <div className="flex-1">
                  <div className="font-medium">{company.name}</div>
                  {company.contactName && (
                    <div className="text-xs text-gray-500">
                      Contacto: {company.contactName}
                    </div>
                  )}
                </div>
                <Check className="h-4 w-4 text-green-600" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
