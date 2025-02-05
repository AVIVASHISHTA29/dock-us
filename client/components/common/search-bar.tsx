"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [, startTransition] = useTransition();

  const changeUrl = (str: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (str) {
      params.set("query", str);
    } else {
      params.delete("query");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = useDebounce((str: string) => changeUrl(str), 1000);

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <Input
        type="search"
        placeholder="Search movies..."
        className="w-full"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
