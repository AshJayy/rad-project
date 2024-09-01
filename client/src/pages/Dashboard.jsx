import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashExamHistory from "../components/DashExamHistory"
import DashReports from "../components/DashReports.jsx";
import PdfFile from "../components/PdfFile.jsx";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    //console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-light-blue">
      <div className="md:w-72">
        {/* Sidebar */}
        
          <DashSidebar />
      </div>
      {/* Exam History */}
      {tab === "history" && <DashExamHistory />}
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {tab === "reports" && <DashReports />}
      {tab === "test" && <PdfFile />}
    </div>
  );
}
