import { useState, useEffect, useCallback } from "react";

interface Company {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
}

interface UseCompanySearchProps {
  debounceMs?: number;
  minQueryLength?: number;
}

export const useCompanySearch = ({
  debounceMs = 300,
  minQueryLength = 2,
}: UseCompanySearchProps = {}) => {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < minQueryLength) {
        setCompanies([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/companies/search?q=${encodeURIComponent(searchQuery)}`
        );

        if (!response.ok) {
          throw new Error("Error al buscar empresas");
        }

        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    },
    [minQueryLength]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCompanies(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, searchCompanies, debounceMs]);

  const clearResults = useCallback(() => {
    setCompanies([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    companies,
    isLoading,
    error,
    clearResults,
  };
};
