import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import ParticipantDashboard from "../participant/ParticipantDashboard";

export default function DashboardIndex() {
  const navigate = useNavigate();
  const role  = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  if (!token) return null;
  if (role === "admin")     return <AdminDashboard />;
  if (role === "organizer") return <OrganizerDashboard />;
  return <ParticipantDashboard />;
}
