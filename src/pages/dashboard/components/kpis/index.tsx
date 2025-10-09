import { useGetKPI } from "../../hookes/use-get-kpis";
import { KpiCard } from "./components/kpi-cards";
import {
  DashboardCardsError,
  DashboardCardsLoader,
} from "./components/loader-errors-states";

export default function KpisCards() {
  const { data, isLoading, isError } = useGetKPI();

  if (isLoading) return <DashboardCardsLoader />;

  if (isError) return <DashboardCardsError />;

  return (
    <div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {
          <>
            {data?.map((kpi, index) => (
              <KpiCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                description={kpi.description}
              />
            ))}
          </>
        }
      </section>
    </div>
  );
}
