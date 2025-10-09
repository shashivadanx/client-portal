import { Main } from "@/components/layout/main";
import Heading from "@/components/layout/heading";
import { ClientDataTable } from "./components/components/table";

export default function ClientJobSubmissions() {
  return (
    <Main>
      <div>
        <Heading
          title="Job Submissions"
          description="View and manage job submissions from candidates. View feedback, manage status, and more."
        />
      </div>
      <ClientDataTable />
    </Main>
  );
}
