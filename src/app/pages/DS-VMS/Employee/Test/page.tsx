"use client";
import PageShell from "@/components/layouts/DS-VMS/PageShell";

export default function DashboardHome() {
  return (
    <PageShell layout="dashboard">
      <div className="grid gap-4">
        <div className="card bg-base-100 p-4 shadow">Stats card1</div>
        <div className="card bg-base-100 p-4 shadow">Recent activity</div>
      </div>
    </PageShell>
  );
}
