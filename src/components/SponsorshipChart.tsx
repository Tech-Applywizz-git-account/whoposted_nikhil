import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  poster: string;
  count: number;
}

interface SponsorshipChartProps {
  data: ChartData[];
  dateLabel?: string;
}

export const SponsorshipChart = ({ data, dateLabel = "Selected Date" }: SponsorshipChartProps) => {
  return (
    <div className="animate-fade-in font-inter">
      {/* Header - Stripe Style */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#061b31] tracking-tight mb-2">
          Top Poster Contributions
        </h3>
        <p className="text-[#64748d] text-sm font-normal">
          Top people contributing to Whoposted job opportunities ({dateLabel})
        </p>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5edf5"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              type="number"
              hide
            />

            <YAxis
              dataKey="poster"
              type="category"
              width={140}
              tick={{
                fontSize: 12,
                fill: "#64748d",
                fontWeight: 400
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-[#e5edf5] rounded-[6px] px-4 py-3 shadow-stripe-lg">
                      <p className="font-bold text-[#061b31] text-[13px] mb-1">{label}</p>
                      <p className="text-[14px] text-[#0a66c2] font-medium">
                        {payload[0].value} <span className="text-[#64748d] font-normal">Jobs Posted</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              fill="#0a66c2"
              radius={[0, 4, 4, 0]}
              barSize={24}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
