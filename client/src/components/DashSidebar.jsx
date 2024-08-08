import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { FaRegUser, FaChartPie, FaArrowLeft, FaDownload,FaRegFileAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const customSidebarTheme = {
  root: {
    inner:
      "h-full overflow-y-auto overflow-x-hidden bg-white px-3 py-4 dark:bg-gray-800",
  },
  item: {
    active: "bg-light-blue dark:bg-gray-700",
    base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-light-blue dark:text-white dark:hover:bg-gray-700",
    icon: {
      base: "h-4 w-4 ml-6 mr-3 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
    },
  },
};

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    //console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-72" theme={customSidebarTheme}>
      <Sidebar.Items className="">
        <Sidebar.ItemGroup className="flex flex-col gap-1 ">
          {currentUser.userLevel > 0 && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={FaChartPie}
                as="div"
                className="border shadow-md"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.userLevel == 0 && (
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={FaRegUser}
                label={currentUser > 0 ? "Admin" : "Student"}
                labelColor="purple"
                as="div"
                className="border shadow-md"
              >
                Profile
              </Sidebar.Item>
            </Link>
            
          )}
          {currentUser.userLevel == 0 && (
            <Link to="/dashboard?tab=reports">
              <Sidebar.Item
                active={tab === "reports"}
                icon={FaDownload}
                as="div"
                className="border shadow-md"
              >
                Downdload Reports
              </Sidebar.Item>
            </Link>
            
          )}
          {currentUser.userLevel == 0 && (
            <Link to="/dashboard?tab=history">
              <Sidebar.Item
                active={tab === "history"}
                icon={FaRegFileAlt}
                as="div"
                className="border shadow-md"
              >
                Exam History
              </Sidebar.Item>
            </Link>
            
          )}

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
