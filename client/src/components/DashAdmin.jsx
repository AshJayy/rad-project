import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiFilm,
} from "react-icons/hi";
import { Line, Bar } from "react-chartjs-2"; // Import Line and Bar components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   Title,
   Tooltip,
   Legend
 );
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashAdmin() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalAds, setTotalAds] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthAds, setLastMonthAds] = useState(0);
  const [totalViewCount, setTotalViewCount] = useState(0);

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/ad/getads?limit=5");
        const data = await res.json();
        if (res.ok) {
          setAds(data.ads);
          setTotalAds(data.totalAds);
          setLastMonthAds(data.lastMonthAds);
          setTotalViewCount(data.totalViewCount);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
      fetchAds();
    }
  }, [currentUser]);

  // Data for Line Chart
  const lineChartData = {
   labels: ["January", "February", "March", "April", "May", "June", "July"],
   datasets: [
     {
       label: "New Users",
       data: [lastMonthUsers, 52, 49, 3, 35, 92, totalUsers],
       fill: false,
       backgroundColor: "rgba(75,192,192,0.2)",
       borderColor: "rgba(75,192,192,1)",
       tension: 0.5
     },
   ],
 };
 const options = {
   animation: {
     duration: 1000, // 1 second animation duration
     easing: "easeInOutQuad", // Smooth easing function
   },
   scales: {
     x: {
       grid: {
         display: false, // Remove x-axis grid lines
       },
     },
     y: {
       grid: {
         display: false, // Remove y-axis grid lines
       },
       beginAtZero: true, // Always start the y-axis at 0
     },
   },
 };
 // Data for Bar Chart
 const barChartData = {
   labels: ["January", "February", "March", "April", "May", "June", "July"],
   datasets: [
     {
       label: "Examinations ",
       data: [lastMonthPosts, 52, 49, 3, 35, 92, totalPosts],
       backgroundColor: "rgba(255, 99, 132, 0.2)",
       borderColor: "rgba(255, 99, 132, 1)",
       borderWidth: 1,
     },
   ],
 };
 
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 w-72 shadow-md">
          <div className="flex gap-5 justify-center">
          <HiOutlineUserGroup className="bg-light-blue  text-black rounded-full text-5xl p-3 shadow-lg" />
            <div className="">
              <h3 className="text-gray-500 text-md uppercase font-bold">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            
          </div>
          
        </div>

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 gap-4 w-72  shadow-md">
          <div className="flex gap-5 justify-center">
          <HiAnnotation className="bg-light-blue  text-black  rounded-full text-5xl p-3 shadow-lg" />
            <div className="">
              <h3 className="text-gray-500 text-md uppercase font-bold">
                Total Exams
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
          </div>
          
        </div>

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 gap-4 w-72  shadow-md">
          <div className="flex  gap-5 justify-center">
          <HiDocumentText className="bg-light-blue  text-black rounded-full text-5xl p-3 shadow-lg" />
            <div className="">
              <h3 className="text-gray-500 text-md uppercase font-bold">Recent Users</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
          </div>
          
        </div>

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 gap-4 w-72  shadow-md">
          <div className="flex gap-5 justify-center">
          <HiFilm className="bg-light-blue  text-black rounded-full text-5xl p-3 shadow-lg" />
            <div className="">
              <h3 className="text-gray-500 text-md uppercase font-bold">Recent Exams</h3>
              <p className="text-2xl">{totalAds}</p>
              
            </div>
          </div>
          
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-2/3 shadow-md p-2 rounded-md dark:bg-gray-800 bg-white">
          {/* Line Chart */}
          <Line data={lineChartData} options={options} />
        </div>

        <div className="flex flex-col w-full md:w-2/3 shadow-md p-2 rounded-md dark:bg-gray-800 bg-white">
          {/* Bar Chart */}
          <Bar data={barChartData} options={options}/>
        </div>
        

        
      </div>
    </div>
  );
}
