"use client";

import * as React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Range = { from?: Date; to?: Date };

function toISO(d?: Date) {
  if (!d) return "";
  // YYYY-MM-DD
  return format(d, "yyyy-MM-dd");
}

function fromISO(s?: string | null) {
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [range, setRange] = React.useState<Range>(() => ({
    from: fromISO(sp.get("from")),
    to: fromISO(sp.get("to")),
  }));

  React.useEffect(() => {
    // sync khi user back/forward
    setRange({ from: fromISO(sp.get("from")), to: fromISO(sp.get("to")) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.get("from"), sp.get("to")]);

  const label = React.useMemo(() => {
    if (range.from && range.to) {
      return `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`;
    }
    if (range.from) return `${format(range.from, "dd/MM/yyyy")} - ...`;
    return "Lọc theo thời gian";
  }, [range]);

  const apply = (r: Range) => {
    const params = new URLSearchParams(sp.toString());

    if (r.from) params.set("from", toISO(r.from));
    else params.delete("from");

    if (r.to) params.set("to", toISO(r.to));
    else params.delete("to");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const quick = (mode: "7d" | "30d" | "90d" | "ytd" | "thisMonth") => {
    const now = new Date();
    const start = new Date(now);

    if (mode === "7d") start.setDate(now.getDate() - 7);
    if (mode === "30d") start.setDate(now.getDate() - 30);
    if (mode === "90d") start.setDate(now.getDate() - 90);

    if (mode === "thisMonth") {
      start.setDate(1);
    }

    if (mode === "ytd") {
      start.setMonth(0, 1);
    }

    const r = { from: start, to: now };
    setRange(r);
    apply(r);
  };

  const clear = () => {
    setRange({});
    const params = new URLSearchParams(sp.toString());
    params.delete("from");
    params.delete("to");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {label}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3" align="start">
          <div className="flex gap-2 pb-2">
            <Button size="sm" variant="secondary" onClick={() => quick("7d")}>
              7 ngày
            </Button>
            <Button size="sm" variant="secondary" onClick={() => quick("30d")}>
              30 ngày
            </Button>
            <Button size="sm" variant="secondary" onClick={() => quick("90d")}>
              3 tháng
            </Button>
            <Button size="sm" variant="secondary" onClick={() => quick("thisMonth")}>
              Tháng này
            </Button>
            <Button size="sm" variant="secondary" onClick={() => quick("ytd")}>
              Từ đầu năm
            </Button>
          </div>

          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range as any}
            onSelect={(r: any) => {
              const next = { from: r?.from, to: r?.to } as Range;
              setRange(next);
            }}
            locale={vi}
            initialFocus
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button size="sm" variant="ghost" onClick={clear}>
              Xoá
            </Button>
            <Button size="sm" onClick={() => apply(range)} disabled={!range.from}>
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
