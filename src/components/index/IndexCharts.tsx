// Charts for the UK AI Energy Index front-end.
// Deliberately small and read-only: they visualise published readings only.

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type SeriesPoint = { label: string; value: number };

export function Sparkline({ data }: { data: SeriesPoint[] }) {
  if (data.length < 2) return null;
  return (
    <div className="mt-4 h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="indexSpark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.28} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number | string) => [Number(v).toLocaleString("en-GB"), "Value"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            className="text-brand"
            stroke="currentColor"
            strokeWidth={2}
            fill="url(#indexSpark)"
            dot={false}
          />
          <XAxis dataKey="label" hide />
          <YAxis hide domain={["auto", "auto"]} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Annual observed series. Zero-based Y axis, described in text beneath the
 * chart, and always accompanied by a data table so the figures never depend
 * on reading the graphic or on distinguishing colours.
 */
export function AnnualSeriesChart({
  data,
  unitLabel,
  description,
}: {
  data: SeriesPoint[];
  unitLabel: string;
  description: string;
}) {
  if (data.length < 2) return null;
  return (
    <figure className="m-0">
      <div className="h-72 w-full" role="img" aria-label={description}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.12} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number | string) => [`${Number(v).toLocaleString("en-GB")} ${unitLabel}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="value"
              className="text-brand"
              stroke="currentColor"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 text-xs text-muted-foreground">{description}</figcaption>
    </figure>
  );
}

export function EditionTrendChart({ data }: { data: SeriesPoint[] }) {
  if (data.length < 2) return null;
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.12} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "currentColor" }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number | string) => [Number(v).toLocaleString("en-GB"), "Headline score"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            className="text-brand"
            stroke="currentColor"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
