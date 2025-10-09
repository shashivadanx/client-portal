import React from "react";
import { JobSection } from "./components";

export default function Jobs() {
  return (
    <div>
      {" "}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Jobs</h2>
        </div>
        <JobSection />
      </section>
    </div>
  );
}
