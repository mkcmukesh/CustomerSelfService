"use client";
import { useState } from "react";
import PageShell from "@/components/Panther-CSS/Layout/PageShell";
import HeaderSummaryBar from "@/components/Panther-CSS/Components/HeaderSummaryBar";
// import SearchFilterBar, { StatusOption, SearchFilter } from "@/components/Panther-CSS/Components/SearchFilterBar";

// ✅ your component
import BreadcrumbWithAgent from "@/components/Panther-CSS/Components/BreadcrumbWithAgent";





export default function NewLayoutPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // (A) Static crumbs for this page
  const crumbs = [
    { label: "Inquiry" },
    { label: "Order" },
    { label: "Accounts" },
    { label: "Complaints" },
    { label: "Performance" },
    { label: "Reports" },
    { label: "Helpdesk" },
    { label: "Profile" }, // current
  ];


  
  // (B) Agent info
  const agent = { name: "Priya Sharma", phone: "9876543210", role: "Agent" };

  return (
    <PageShell
      tone="app"
      containerClassName="max-w-7xl mx-auto"
      showHeader={showHeader}
      showFooter={showFooter}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      leftSidebarWidth={240}
      rightSidebarWidth={300}
      rightCollapsedWidth={72}
      leftCollapsed={leftCollapsed}
      onLeftCollapsedChange={setLeftCollapsed}
      rightOpen={rightOpen}
      onRightOpenChange={setRightOpen}
      rightCollapsed={rightCollapsed}
      onRightCollapsedChange={setRightCollapsed}
    >
      <div className="grid gap-0">
        <div className="card p-0 shadow">
          {/* ▼ Place Breadcrumb + Agent here */}
          <BreadcrumbWithAgent
            items={crumbs}
            agent={agent}
            // remove black bar since we're inside a white card
            className="!bg-white px-0 py-0"
          />
          <HeaderSummaryBar
        title="Shop"
        subtitle="View and manage your orders, documents, and status updates."
        metrics={[
          { label: "Total", value: 0 },
          { label: "In Process", value: 0 },
        ]}
        bleed   // set to false if you want to respect container padding
      />
         {/* <SearchFilterBar
        title="Search"
        statusOptions={statusOptions}
        onSearch={handleSearch}
        onReset={handleReset}
        className="!px-0"    // edge-to-edge inside a container if needed
      /> */}
        </div>
      </div>
    </PageShell>
  );
}
