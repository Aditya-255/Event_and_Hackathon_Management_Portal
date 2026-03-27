import React from "react";
import AdminDashboard from "./AdminDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import ParticipantDashboard from "../participant/ParticipantDashboard";

export default function DashboardIndex(){
  const role=localStorage.getItem("userRole")||"participant";
  if(role==="admin") return <AdminDashboard/>;
  if(role==="organizer") return <OrganizerDashboard/>;
  return <ParticipantDashboard/>;
}
