"use client";

import React, { useState, useRef } from "react";
import { UserRound, Mail, Lock, Phone, CalendarDays, Briefcase, Shield, Building, Check } from "lucide-react";

export default function EmployeeRegistration() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    employeeCode: "",
    phone: "",
    dob: "",
    approver: "",
    password: "",
  });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      setStep(3);
      setTimeout(() => alert("✅ Employee registered successfully!"), 800);
    } else {
      alert("Please enter the full 4-digit OTP");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-400 via-sky-500 to-sky-700 relative overflow-hidden">
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      ></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-6 sm:p-8">
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src="https://randomuser.me/api/portraits/men/46.jpg"
                  alt="Employee"
                  className="w-24 h-24 rounded-full border-4 border-sky-500 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                  <Check size={16} />
                </div>
              </div>
              <h2 className="mt-3 text-lg font-semibold">Employee Registration</h2>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <UserRound size={18} /> 
                <input
                  type="text"
                  required
                  placeholder="Employee Name"
                  className="grow"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <Briefcase size={18} />
                <input
                  type="text"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <Building size={18} />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <Shield size={18} />
                <input
                  type="text"
                  placeholder="Employee Code"
                  value={formData.employeeCode}
                  onChange={(e) => handleChange("employeeCode", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <Phone size={18} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <CalendarDays size={18} />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <UserRound size={18} />
                <input
                  type="text"
                  placeholder="Approver / Reporting Manager"
                  value={formData.approver}
                  onChange={(e) => handleChange("approver", e.target.value)}
                  className="grow"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Set Password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="flex gap-3 mt-5">
              <button type="submit" className="btn btn-primary flex-1">
                Submit
              </button>
              <button type="reset" className="btn btn-outline flex-1">
                Cancel
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-sky-700">Phone Verification</h3>
            <p className="text-sm text-gray-700 mb-4">
              We have sent an OTP to your mobile number.
              <br />
              Please type it below to continue.
            </p>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-10 h-10 text-center text-lg font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400"
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              className="btn btn-primary w-full mb-2"
            >
              Continue
            </button>
            <p className="text-xs text-gray-600">
              Didn’t get OTP?{" "}
              <button className="link text-sky-600 hover:underline">Resend OTP</button>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-700">Registration Successful</h3>
            <p className="text-sm text-gray-600">
              Your account has been created successfully.
            </p>
            <button className="btn btn-primary w-full mt-3" onClick={() => setStep(1)}>
              Register Another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
