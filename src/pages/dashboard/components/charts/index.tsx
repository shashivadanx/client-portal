import { CandidateStatusChart } from "./component/candidate-status";
import { FeedbackByJobChart } from "./component/feedback-by-jobs";

export default function ClientChatIndex() {
  return (
    <div>
      {" "}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <FeedbackByJobChart />
          <CandidateStatusChart />
        </div>
      </section>
    </div>
  );
}
