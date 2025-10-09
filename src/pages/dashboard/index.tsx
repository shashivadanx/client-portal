import Heading from "@/components/layout/heading";
import { Main } from "@/components/layout/main";
import KpisCards from "./components/kpis";
import ClientChatIndex from "./components/charts";
import Jobs from "./components/client-jobs";

export default function DashboardIndex() {
  return (
    <Main>
      <div className="space-y-3">
        <Heading
          title="Recruitment Dashboard"
          description="Combined overview of recruiting performance and active jobs"
        />
        <div className="space-y-3">
          <KpisCards />
          <ClientChatIndex />
          <Jobs />
        </div>
      </div>
    </Main>
  );
}
