"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Day } from "@prisma/client"
import { HandCoins } from "lucide-react"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartConfig = {
} satisfies ChartConfig

const colors = [
  "#00FFFF", "#800080", "#0000FF", "#008000", "#FF00FF", "#808000", "#FF0000", "#000080", "#FFFF00", "#008080", "#00FF00", "#800000"
];

const dayColorMap: Record<Day, string> = Object.values(Day).reduce((acc, dayName, index) => {
  acc[dayName] = colors[index % colors.length];
  return acc;
}, {} as Record<Day, string>);

interface Props {
  data: { day: Day, amount: number }[]
}

export function WeeklyIncomeChart({ data }: Props) {
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      browser: item.day,
      visitors: item.amount,
      fill: dayColorMap[item.day] // Use the color from the map
    }))
  }, [data])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col p-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-md font-medium">Weekly Salary</CardTitle>
        <HandCoins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}