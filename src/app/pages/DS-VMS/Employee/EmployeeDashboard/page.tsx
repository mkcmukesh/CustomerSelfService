"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { UserCheck, Briefcase, Star, Cake, Bell, Quote, Zap, Calendar, CalendarCheck, CalendarDays, Clock, UserCog, Home, BarChart3, Settings, FileText, ArrowUpDown, TrendingUp, Award, AlarmClock, Activity, BarChart, BarChart2, Umbrella, } from "lucide-react";
import { Activity as Timeline } from "lucide-react";
import CountUp from "react-countup";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, } from "recharts";

import AttendanceTable from "@/app/components/tables/AttendanceTable";


const EMPLOYEE_AVATAR = "https://randomuser.me/api/portraits/men/45.jpg";
const dotBg: React.CSSProperties = {
  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0",
};

// Generate dummy attendance data
const generateData = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const present = Math.random() > 0.1;
    return {
      date: `2025-03-${String(day).padStart(2, "0")}`,
      punchIn: present ? `09:0${Math.floor(Math.random() * 5)} AM` : "-",
      punchOut: present ? `06:1${Math.floor(Math.random() * 5)} PM` : "-",
      status: present ? "Present" : "Absent",
    };
  });

// Dummy leave distribution for pie chart
const LEAVE_DATA = [
  { name: "Casual", value: 4 },
  { name: "Sick", value: 2 },
  { name: "Earned", value: 6 },
];

const COLORS = ["#0284c7", "#0d9488", "#f97316"];

export default function EmployeeAttendance() {
  const [month, setMonth] = useState("2025-03");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibleRows, setVisibleRows] = useState(5);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [ascending, setAscending] = useState(true);

  // ✅ Move these two here:
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const ATTENDANCE_DATA = useMemo(() => generateData(31), []);

  const sortedData = useMemo(() => {
    let filtered = [...ATTENDANCE_DATA];
    if (statusFilter !== "All") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    return filtered.sort((a, b) => {
      if (sortBy === "date")
        return ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      if (sortBy === "status")
        return ascending ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      return 0;
    });
  }, [ATTENDANCE_DATA, statusFilter, sortBy, ascending]);

  const presentDays = ATTENDANCE_DATA.filter((d) => d.status === "Present").length;
  const totalDays = ATTENDANCE_DATA.length;
  const leavesTaken = 4;
  const leaveBalance = 12 - leavesTaken;
  const attendancePercent = ((presentDays / totalDays) * 100).toFixed(1);
  const overtimeHours = 12;
  const punctualityScore = 93;

  const trendData = [
    { day: "Week 1", attendance: 90 },
    { day: "Week 2", attendance: 94 },
    { day: "Week 3", attendance: 92 },
    { day: "Week 4", attendance: 95 },
  ];

  const toggleSort = (field: "date" | "status") => {
    if (sortBy === field) setAscending(!ascending);
    else {
      setSortBy(field);
      setAscending(true);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex overflow-hidden text-gray-800">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-700" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={dotBg} />

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-sky-600 via-sky-500 to-blue-700 text-white backdrop-blur-lg shadow-2xl p-5 z-20">
        <div className="flex flex-col items-center mb-6">
          <img
            src={EMPLOYEE_AVATAR}
            alt="Employee avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <h3 className="text-lg font-semibold mt-3">John Doe</h3>
          <p className="text-sm text-blue-100">Software Engineer</p>
        </div>

        <nav className="flex-1 space-y-3">
          <Link href="/DsAMS/EmployeeDashboard" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/20 transition">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/DsAMS/EmployeeAttendance" className="flex items-center gap-3 p-2 rounded-lg bg-white/20 font-semibold">
            <Clock className="w-5 h-5" /> Attendance
          </Link>
          <Link href="/DsAMS/Reports" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/20 transition">
            <BarChart3 className="w-5 h-5" /> Reports
          </Link>
          <Link href="/DsAMS/Settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/20 transition">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className="pt-5 border-t border-white/20 text-sm text-blue-100">
          © 2025 YourBrand
        </div>
      </aside>

      {/* Main Section */}
      <section className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-md px-5 py-3 mb-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-sky-600" />
            Employee Attendance Analytics
          </h2>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="input input-bordered input-primary max-w-xs bg-slate-50"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Days Present", value: presentDays, color: "text-sky-600" },
            { title: "Leaves Taken", value: leavesTaken, color: "text-orange-500" },
            { title: "Attendance %", value: attendancePercent + "%", color: "text-green-600" },
            { title: "Overtime Hours", value: overtimeHours, color: "text-teal-600" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg p-5 text-center hover:shadow-xl transition-all"
            >
              <h3 className="text-sm font-semibold text-gray-600">{card.title}</h3>
              <p className={`text-4xl font-bold mt-2 ${card.color}`}>
                <CountUp end={Number(card.value.toString().replace("%", ""))} duration={2} />{card.value.toString().includes("%") ? "%" : ""}
              </p>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* 1️⃣ Days Present – Icon Card */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-5 shadow-md hover:shadow-lg transition-all text-center">
            <div className="flex justify-center mb-2">
              <CalendarCheck className="w-10 h-10 text-sky-600 animate-pulse" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600">Days Present</h3>
            <p className="text-4xl font-bold text-sky-600 mt-1">
              <CountUp end={presentDays} duration={2} />
            </p>
            <p className="text-xs text-gray-500 mt-1">Out of 30 working days</p>
          </div>

          {/* 2️⃣ Leaves Taken – Progress Circle Card */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-orange-200 p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Leaves Taken</h3>
            <div className="relative w-20 h-20 mb-2">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#f3f4f6" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#fb923c"
                  strokeWidth="10"
                  strokeDasharray={`${(leavesTaken / 10) * 283} 283`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-orange-500">
                {leavesTaken}
              </span>
            </div>
            <p className="text-xs text-gray-500">Used of 10 allowed</p>
          </div>

          {/* 3️⃣ Attendance % – Linear Progress Card */}
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-5 border border-green-200 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Attendance %</h3>
            <p className="text-4xl font-bold text-green-600">
              <CountUp end={Number(attendancePercent)} duration={2} />%
            </p>
            <div className="w-full bg-white/60 rounded-full h-3 mt-3 overflow-hidden border border-green-100">
              <div
                className="h-3 rounded-full bg-green-500 transition-all"
                style={{ width: `${attendancePercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: 95%</p>
          </div>

          {/* 4️⃣ Overtime Hours – Compact Stat Card */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-teal-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Overtime Hours</h3>
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-4xl font-bold text-teal-600">
              <CountUp end={overtimeHours} duration={2} />
            </p>
            <p className="text-xs text-gray-500 mt-1">This month’s total</p>
            <div className="mt-3 text-xs">
              <span className="text-teal-600 font-semibold">+2.5h</span> from last month
            </div>
          </div>

        </div>

        {/* Unified Summary Card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-sky-700">
            <BarChart2 className="w-6 h-6" /> Attendance Summary Overview
          </h2>

          {/* Responsive layout: 4 in a row or stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* 1️⃣ Days Present */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-5 hover:shadow-lg transition-all">
              <CalendarCheck className="w-10 h-10 text-sky-600 mb-2" />
              <h3 className="text-sm font-semibold text-gray-600">Days Present</h3>
              <p className="text-4xl font-bold text-sky-600 mt-1">
                <CountUp end={presentDays} duration={2} />
              </p>
              <p className="text-xs text-gray-500 mt-1">Out of 30 working days</p>
            </div>

            {/* 2️⃣ Leaves Taken */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-white/80 backdrop-blur-md border border-orange-200 p-5 hover:shadow-lg transition-all">
              <Umbrella className="w-10 h-10 text-orange-500 mb-2" />
              <h3 className="text-sm font-semibold text-gray-600">Leaves Taken</h3>
              <div className="relative w-20 h-20 my-2">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#f3f4f6" strokeWidth="10" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#fb923c"
                    strokeWidth="10"
                    strokeDasharray={`${(leavesTaken / 10) * 283} 283`}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-orange-500">
                  {leavesTaken}
                </span>
              </div>
              <p className="text-xs text-gray-500">Used of 10 allowed</p>
            </div>

            {/* 3️⃣ Attendance % */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-5 hover:shadow-lg transition-all">
              <BarChart className="w-10 h-10 text-green-600 mb-2" />
              <h3 className="text-sm font-semibold text-gray-600">Attendance %</h3>
              <p className="text-4xl font-bold text-green-600 mt-1">
                <CountUp end={Number(attendancePercent)} duration={2} />%
              </p>
              <div className="w-full bg-white/60 rounded-full h-3 mt-3 overflow-hidden border border-green-100">
                <div
                  className="h-3 rounded-full bg-green-500 transition-all"
                  style={{ width: `${attendancePercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: 95%</p>
            </div>

            {/* 4️⃣ Overtime Hours */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-200 p-5 hover:shadow-lg transition-all">
              <Clock className="w-10 h-10 text-teal-600 mb-2" />
              <h3 className="text-sm font-semibold text-gray-600">Overtime Hours</h3>
              <p className="text-4xl font-bold text-teal-600 mt-1">
                <CountUp end={overtimeHours} duration={2} />
              </p>
              <p className="text-xs text-gray-500 mt-1">This month’s total</p>
              <div className="mt-2 text-xs">
                <span className="text-teal-600 font-semibold">+2.5h</span> from last month
              </div>
            </div>

          </div>
        </div>


        {/* Compact Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Punctuality */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/40 text-center">
            <AlarmClock className="w-10 h-10 text-sky-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Punctuality Score</h3>
            <p className="text-3xl font-bold text-sky-600">
              <CountUp end={punctualityScore} duration={2} />%
            </p>
          </div>

          {/* Performance Tips */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/40 text-center">
            <Award className="w-10 h-10 text-teal-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Performance Tips</h3>
            <p className="text-sm text-gray-700 mt-1">
              Great attendance this month! Aim for 95% to earn a recognition badge.
            </p>
          </div>

          NEW OBJECT




        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Attendance Trend Chart with Interactive Analysis */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/40">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" /> Attendance Trend Analysis
            </h3>

            {/* Interactive Chart */}
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                  }}
                  labelStyle={{ color: '#0284c7', fontWeight: 600 }}
                />
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#0284c7', fill: '#fff' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Analytical Insights */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                <p className="text-gray-500 text-xs">Average</p>
                <p className="text-lg font-semibold text-sky-700">
                  {(
                    trendData.reduce((sum, d) => sum + d.attendance, 0) / trendData.length
                  ).toFixed(1)}%
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <p className="text-gray-500 text-xs">Highest</p>
                <p className="text-lg font-semibold text-emerald-700">
                  {Math.max(...trendData.map((d) => d.attendance))}%
                </p>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                <p className="text-gray-500 text-xs">Lowest</p>
                <p className="text-lg font-semibold text-rose-700">
                  {Math.min(...trendData.map((d) => d.attendance))}%
                </p>
              </div>
            </div>
          </div>


          {/* Employee Performance Overview */}
          <div className="col-span-2 rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-lg border border-white/40 mb-8">
            {/* Header */}
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-sky-700">
              <TrendingUp className="w-6 h-6" /> Employee Performance Overview
            </h2>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Punctuality & Insights Card */}
              <div className="col-span-1 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 p-5 border border-sky-200 shadow-inner hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center">
                  <AlarmClock className="w-10 h-10 text-sky-600 mx-auto mb-2 animate-pulse" />
                  <h3 className="text-lg font-semibold text-sky-800">Punctuality Score</h3>
                  <p className="text-4xl font-bold text-sky-600 mt-1">
                    <CountUp end={punctualityScore} duration={2} />%
                  </p>
                </div>
                <div className="mt-4 bg-white/70 rounded-xl p-3 text-sm border border-sky-100">
                  <p className="text-gray-700 leading-snug">
                    Keep your score above <span className="font-semibold text-sky-700">90%</span> to
                    unlock the <span className="font-semibold text-emerald-700">“Star Performer”</span> badge!
                  </p>
                </div>
              </div>

              {/* Interactive Trend Chart */}
              <div className="col-span-2 rounded-2xl bg-white/90 backdrop-blur-md p-5 shadow-inner border border-gray-200 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                  <Activity className="w-5 h-5 text-teal-600" /> Attendance Trend Analysis
                </h3>

                {/* Interactive Chart */}
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#555' }} />
                    <YAxis hide />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Attendance']}
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        fontSize: '0.85rem',
                      }}
                      labelStyle={{ color: '#0284c7', fontWeight: 600 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#fff', stroke: '#0284c7', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#0284c7' }}
                      animationDuration={1200}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Key Insights */}
                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 hover:shadow-md transition">
                    <p className="text-gray-500 text-xs">Average</p>
                    <p className="text-lg font-semibold text-sky-700">
                      {(
                        trendData.reduce((sum, d) => sum + d.attendance, 0) / trendData.length
                      ).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 hover:shadow-md transition">
                    <p className="text-gray-500 text-xs">Highest</p>
                    <p className="text-lg font-semibold text-emerald-700">
                      {Math.max(...trendData.map((d) => d.attendance))}%
                    </p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 hover:shadow-md transition">
                    <p className="text-gray-500 text-xs">Lowest</p>
                    <p className="text-lg font-semibold text-rose-700">
                      {Math.min(...trendData.map((d) => d.attendance))}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Insights Row */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                <Award className="w-5 h-5 text-emerald-600 inline-block mr-2" />
                <span className="font-semibold text-emerald-800">Performance Tip:</span>
                <p className="text-sm text-gray-700 mt-1">
                  Great attendance this month! Aim for <strong>95%</strong> to earn a
                  recognition badge.
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <Zap className="w-5 h-5 text-amber-600 inline-block mr-2" />
                <span className="font-semibold text-amber-800">Motivation:</span>
                <p className="text-sm text-gray-700 mt-1">
                  Consistent effort today builds tomorrow’s success. Keep your streak strong!
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
                <Clock className="w-5 h-5 text-blue-600 inline-block mr-2" />
                <span className="font-semibold text-blue-800">Next Goal:</span>
                <p className="text-sm text-gray-700 mt-1">
                  Improve morning login time by <strong>5 mins</strong> for better punctuality.
                </p>
              </div>
            </div>
          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* 📊 Enhanced & Interactive Leave Type Distribution */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow-lg border border-white/40 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" /> Leave Type Distribution & Insights
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Pie Chart */}
              <div className="relative flex justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={LEAVE_DATA}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      animationDuration={1000}
                      isAnimationActive={true}
                      onMouseEnter={(data, index) => {
                        const slice = document.getElementById(`slice-${index}`);
                        if (slice) slice.setAttribute("r", "82"); // hover zoom
                      }}
                      onMouseLeave={(data, index) => {
                        const slice = document.getElementById(`slice-${index}`);
                        if (slice) slice.setAttribute("r", "80");
                      }}
                    >
                      {LEAVE_DATA.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          id={`slice-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth={2}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center numeric total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-sky-600">
                    {LEAVE_DATA.reduce((acc, cur) => acc + cur.value, 0)}
                  </span>
                  <span className="text-sm text-gray-500">Total Leaves</span>
                </div>
              </div>

              {/* Data Insights & Legend */}
              <div className="space-y-3">
                <ul className="text-sm space-y-2">
                  {LEAVE_DATA.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full group-hover:scale-125 transition-transform"
                          style={{ backgroundColor: COLORS[idx] }}
                        ></span>
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{item.value} days</span>
                    </li>
                  ))}
                </ul>

                {/* Comparison bars */}
                <div className="mt-3 space-y-2">
                  {LEAVE_DATA.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.name}</span>
                        <span>{item.value} / 12</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${(item.value / 12) * 100}%`,
                            backgroundColor: COLORS[idx],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Utilization Summary Box */}
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-teal-50 border border-teal-100">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-teal-600" />
                    <span>
                      You’ve utilized{" "}
                      <strong className="text-sky-600">
                        {(LEAVE_DATA.reduce((a, b) => a + b.value, 0) / 12 * 100).toFixed(1)}%
                      </strong>{" "}
                      of your annual leave quota.
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Maintain 70–80% usage to balance work-life and emergency flexibility.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* 🗓️ Dynamic Attendance Calendar Heatmap with Summary */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow-lg border border-white/40 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" /> Attendance Calendar Heatmap
            </h3>

            {(() => {
              // Extract selected month and year from your `month` state (e.g., "2025-03")
              const [year, monthNumber] = month.split("-").map(Number);
              const daysInMonth = new Date(year, monthNumber, 0).getDate();

              const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(year, monthNumber - 1, i + 1);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
                const today = date.toDateString() === new Date().toDateString();

                // match dummy attendance data
                const data = ATTENDANCE_DATA.find(
                  (d) =>
                    d.date ===
                    `${year}-${String(monthNumber).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
                );

                return {
                  date,
                  status: data ? data.status : "Absent",
                  isWeekend,
                  today,
                };
              });

              const presentCount = daysArray.filter((d) => d.status === "Present").length;
              const absentCount = daysArray.filter(
                (d) => !d.isWeekend && d.status === "Absent"
              ).length;
              const weekendCount = daysArray.filter((d) => d.isWeekend).length;
              const attendancePercent = (
                (presentCount / (daysArray.length - weekendCount)) *
                100
              ).toFixed(1);

              return (
                <>
                  <div className="grid grid-cols-7 sm:grid-cols-7 gap-2 justify-items-center">
                    {daysArray.map((d) => (
                      <div
                        key={d.date.toISOString()}
                        title={`${d.date.toDateString()}: ${d.status}`}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm border border-white/40 transition-transform hover:scale-110 ${d.isWeekend
                          ? "bg-gray-300"
                          : d.status === "Present"
                            ? "bg-green-400"
                            : "bg-red-400"
                          } ${d.today ? "ring-2 ring-sky-500 ring-offset-2" : ""}`}
                      />
                    ))}
                  </div>

                  {/* Summary Line */}
                  <div className="mt-5 text-center text-sm font-medium text-gray-700">
                    <span className="text-green-600">Present:</span> {presentCount} |
                    <span className="text-red-500"> Absent:</span> {absentCount} |
                    <span className="text-gray-500"> Weekend:</span> {weekendCount} |
                    <span className="text-sky-600"> Attendance:</span> {attendancePercent}%
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-400 rounded-sm"></span> Present
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-red-400 rounded-sm"></span> Absent
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-gray-300 rounded-sm"></span> Weekend
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-sky-500 rounded-sm"></span> Today
                    </div>
                  </div>
                </>
              );
            })()}
          </div>


          {/* Attendance Table Section */}
          <div className="col-span-1">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
              <div className="flex gap-2 items-center">
                <label className="font-medium text-gray-700">Filter:</label>
                <select
                  className="select select-bordered select-sm bg-slate-50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Present</option>
                  <option>Absent</option>
                </select>
              </div>
            </div>

            {/* Use Modular Table */}
            <AttendanceTable
              data={sortedData}
              rowsPerPage={5}
              onSort={toggleSort}
            />
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          NEW OBJECT
          NEW OBJECT

          {/* Employee Journey Overview */}
          <div className="col-span-2 rounded-3xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-indigo-700">
              <UserCheck className="w-6 h-6" /> Employee Journey Overview
            </h2>

            {/* Employee Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Date of Joining */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 text-center hover:shadow-md transition-all">
                <Briefcase className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-gray-600">Date of Joining</h3>
                <p className="text-xl font-bold text-indigo-700 mt-1">15 Mar 2020</p>
                <p className="text-xs text-gray-500 mt-1">
                  <CountUp end={((new Date().getFullYear() - 2020) * 12 + (new Date().getMonth() - 2))} duration={2} /> months ago
                </p>
              </div>

              {/* Appraisal Date */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 text-center hover:shadow-md transition-all">
                <Star className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-gray-600">Next Appraisal</h3>
                <p className="text-xl font-bold text-emerald-700 mt-1">25 Dec 2025</p>
                <p className="text-xs text-gray-500 mt-1">In about 2 months</p>
              </div>

              {/* Date of Birth */}
              <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-5 text-center hover:shadow-md transition-all">
                <Cake className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-gray-600">Date of Birth</h3>
                <p className="text-xl font-bold text-rose-700 mt-1">10 Nov 1990</p>
                <p className="text-xs text-gray-500 mt-1">Age: {new Date().getFullYear() - 1990}</p>
              </div>

              {/* Birthday Reminder */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-5 text-center hover:shadow-md transition-all">
                <Bell className="w-8 h-8 text-amber-600 mx-auto mb-2 animate-bounce" />
                <h3 className="text-sm font-semibold text-gray-600">Next Birthday</h3>
                <p className="text-xl font-bold text-amber-700 mt-1">10 Nov 2025</p>
                <p className="text-xs text-gray-500 mt-1">Reminder: 22 days left 🎉</p>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <Timeline className="w-5 h-5 text-sky-600" /> Journey Progress
              </h3>
              <div className="relative border-l-4 border-sky-300 pl-6">
                {[
                  { date: "15 Mar 2020", title: "Joined Company", desc: "Started as Junior Developer" },
                  { date: "01 Jan 2021", title: "First Appraisal", desc: "Promoted to Developer" },
                  { date: "05 Jan 2023", title: "Second Appraisal", desc: "Upgraded to Senior Developer" },
                  { date: "10 Jun 2024", title: "Leadership Program", desc: "Completed Skill Advancement Training" },
                  { date: "25 Dec 2025", title: "Next Appraisal", desc: "Performance Review Scheduled" },
                ].map((event, index) => (
                  <div key={index} className="mb-6 relative">
                    <div className="absolute -left-3 top-1.5 w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-md"></div>
                    <div className="ml-4">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <h4 className="text-sm font-semibold text-gray-800">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee Journey - Horizontal Timeline */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-5 text-gray-700 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" /> Journey Progress
              </h3>

              <div className="relative flex flex-wrap lg:flex-nowrap items-start justify-between bg-white/70 rounded-2xl p-6 border border-sky-200 shadow-inner overflow-x-auto scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-sky-100">

                {[
                  { date: "15 Mar 2020", title: "Joined Company", desc: "Started as Junior Developer" },
                  { date: "01 Jan 2021", title: "First Appraisal", desc: "Promoted to Developer" },
                  { date: "05 Jan 2023", title: "Second Appraisal", desc: "Upgraded to Senior Developer" },
                  { date: "10 Jun 2024", title: "Leadership Program", desc: "Completed Skill Advancement Training" },
                  { date: "25 Dec 2025", title: "Next Appraisal", desc: "Performance Review Scheduled" },
                ].map((event, index, arr) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center min-w-[180px] flex-1"
                  >
                    {/* Connector Line */}
                    {index < arr.length - 1 && (
                      <div className="absolute top-[30px] left-[50%] w-full border-t-4 border-sky-300 z-0"></div>
                    )}

                    {/* Timeline Circle */}
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white font-semibold shadow-md">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <h4 className="text-sm font-semibold text-gray-800">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.desc}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>



            {/* Quote Section */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-center shadow-inner">
              <Quote className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="italic text-gray-700">
                “Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.”
              </p>
              <p className="text-xs text-gray-500 mt-2">— Albert Schweitzer</p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Use filters, sorting, and pagination to analyze attendance records.
        </p>
      </section>
    </main>
  );
}
