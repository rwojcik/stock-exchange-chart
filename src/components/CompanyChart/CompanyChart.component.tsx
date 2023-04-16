import { useQuery } from "react-query";
import { Company } from "../CompanySelector/CompanySelector.component";
import { LineChart } from "../LineChart/LineChart.component";

type TimeSeriesResponse = {
  dataset_data: {
    data: Array<[string, number]>;
  };
};

type TimeSeriesData = {
  dateLabels: Array<string>;
  values: Array<number>;
};

type CompanyChartProps = {
  company?: Company;
  apiKey?: string;
};

export function CompanyChart({ company, apiKey }: CompanyChartProps) {

  const { isLoading, isError, data, error } = useQuery<TimeSeriesData, Error>(
    ["timeSeriesData", apiKey, company?.dataset_code],
    async () => {
      const response = await fetch(
        `https://data.nasdaq.com/api/v3/datasets/WIKI/${company?.dataset_code}/data?column_index=4&api_key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch time-series data");
      }
      const json = (await response.json()) as TimeSeriesResponse;
      return json.dataset_data.data.reduce<TimeSeriesData>(
        (prev, [date, value]) => ({
          dateLabels: [...prev.dateLabels, date],
          values: [...prev.values, value],
        }),
        { values: [], dateLabels: [] }
      );
    },
    {
      enabled: company?.dataset_code != null,
    }
  );

  if (company == null) {
    return <div>Select company</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (data == null || data.dateLabels.length === 0) {
    return <div>Time series data is missing</div>;
  }

  return (
    <LineChart
      data={data.values}
      labels={data.dateLabels}
      seriesLabel={company.name}
    />
  );
}
