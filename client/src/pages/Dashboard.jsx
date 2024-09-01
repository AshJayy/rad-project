import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUserManagement from "../components/DashUserManagement";
import DashQAManagement from "../components/DashQAManagement";
import { useSelector } from "react-redux";
import DashAdmin from "../components/DashAdmin";
import DashExamHistory from "../components/DashExamHistory"
import DashReports from "../components/DashReports.jsx";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
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

      {/* User Profile */}
      {tab === "profile" && <DashProfile />}
      {currentUser.userLevel === 0 && (
        <>
          {/* Exam history */
          tab === "dash" && <DashExamHistory />}
          {tab === "reports" && <DashReports />}
        </>
      )}

      {currentUser.userLevel === 2 && (
        <>

          {/* User Management */}
          {tab === "userMan" && <DashUserManagement />}
          
        </>
      )}
      {currentUser.userLevel > 0 && (
        <>
          {/* Dashboard */}
          {tab === "dash" && <DashAdmin />}
          {/* QA Management */}
          {tab === "qaMan" && <DashQAManagement />}
        </>
      )}

    </div>
  );
}
