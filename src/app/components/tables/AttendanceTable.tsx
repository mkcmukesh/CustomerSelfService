"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";

interface AttendanceEntry {
  date: string;
  punchIn: string;
  punchOut: string;
  status: string;
}

interface AttendanceTableProps {
  data: AttendanceEntry[];
  rowsPerPage?: number;
  onSort?: (field: "date" | "status") => void;
}

export default function AttendanceTable({
  data,
  rowsPerPage = 5,
  onSort,
}: AttendanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Reset page when data changes (filter, sort, etc.)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  // Dynamic pagination numbers (1 2 3 ...)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg overflow-hidden">
      <table className="table w-full text-gray-800">
        <thead className="bg-sky-600 text-white">
          <tr>
            <th
              onClick={() => onSort && onSort("date")}
              className="cursor-pointer"
            >
              Date <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </th>
            <th>Punch In</th>
            <th>Punch Out</th>
            <th
              onClick={() => onSort && onSort("status")}
              className="cursor-pointer"
            >
              Status <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((entry) => (
              <tr key={entry.date} className="hover:bg-sky-100 transition-all">
                <td>{entry.date}</td>
                <td>{entry.punchIn}</td>
                <td>{entry.punchOut}</td>
                <td
                  className={
                    entry.status === "Present"
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {entry.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white/70 border-t border-gray-200 gap-3 flex-wrap sm:flex-nowrap">
        {/* Showing Info */}
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{endIndex}</span> of{" "}
          <span className="font-medium">{data.length}</span> days{" "}
          <span className="text-gray-500">|</span>{" "}
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages || 1}</span>
        </p>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Number Buttons */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm ${
                page === currentPage ? "btn-primary" : "btn-outline"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-sm btn-outline"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
