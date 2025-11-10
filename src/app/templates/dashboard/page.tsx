"use client";
import PageShell from "@/components/layouts/PageShell";

export default function DashboardHome() {
  return (
    <PageShell layout="dashboard">
      <div className="grid gap-4">
        <div className="card bg-base-100 p-4 shadow">Stats card</div>
        <div className="card bg-base-100 p-4 shadow">Recent activity</div>
      </div>
    </PageShell>
  );
}
