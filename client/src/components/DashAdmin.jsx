import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiAnnotation, HiOutlineUserGroup, HiDocumentText, HiFilm } from "react-icons/hi";
import { Line, Bar } from "react-chartjs-2";
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

export default function DashAdmin() {
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalExams, setTotalExams] = useState(0);

  const [thisMonthUsers, setThisMonthUsers] = useState(0);
  const [thisMonthExams, setThisMonthExams] = useState(0);
  
  const [lastSevenMonthsUsers, setLastSevenMonthsUsers] = useState([]);
  const [lastSevenMonthsExams, setLastSevenMonthsExams] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastSevenMonthsUsers(data.lastSevenMonthsData);
          setThisMonthUsers(data.lastSevenMonthsData[0])
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };

    const fetchExams = async () => {
      try {
        const res = await fetch("/api/exam/getexams");
        const data = await res.json();
        if (res.ok) {
          setExams(data.exams);
          setTotalExams(data.totalExams);
          setLastSevenMonthsExams(data.lastSevenMonthsData);
          setThisMonthExams(data.lastSevenMonthsData[0])
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };

    if (currentUser.userLevel > 0) {
      fetchUsers();
      fetchExams();
    }
  }, [currentUser]);

  // Data for Line Chart
  const lineChartData = {
    labels: lastSevenMonthsUsers.map((item) => item.month).reverse(),
    datasets: [
      {
        label: "New Users",
        data: lastSevenMonthsUsers.map((item) => item.usersCount).reverse(),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.5,
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
    labels: lastSevenMonthsExams.map((item) => item.month).reverse(),
    datasets: [
      {
        label: "Examinations",
        data: lastSevenMonthsExams.map((item) => item.examsCount).reverse(),
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
            <HiOutlineUserGroup className="bg-light-blue text-black rounded-full text-5xl p-3 shadow-lg" />
            <div>
              <h3 className="text-gray-500 text-md uppercase font-bold">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 gap-4 w-72 shadow-md">
          <div className="flex gap-5 justify-center">
            <HiAnnotation className="bg-light-blue text-black rounded-full text-5xl p-3 shadow-lg" />
            <div>
              <h3 className="text-gray-500 text-md uppercase font-bold">Total Exams</h3>
              <p className="text-2xl">{totalExams}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 gap-4 w-72 shadow-md">
          <div className="flex gap-5 justify-center">
            <HiDocumentText className="bg-light-blue text-black rounded-full text-5xl p-3 shadow-lg" />
            <div>
              <h3 className="text-gray-500 text-md uppercase font-bold">Recent Users</h3>
              <p className="text-2xl">{thisMonthUsers.usersCount}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 bg-white rounded-xl dark:bg-slate-800 gap-4 w-72 shadow-md">
          <div className="flex gap-5 justify-center">
            <HiFilm className="bg-light-blue text-black rounded-full text-5xl p-3 shadow-lg" />
            <div>
              <h3 className="text-gray-500 text-md uppercase font-bold">Recent Exams</h3>
              <p className="text-2xl">{thisMonthExams.examsCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 md:mx-auto">
        {!isLoading ? (
          <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
            <div className="flex flex-col w-full md:w-2/3 shadow-md p-2 rounded-md dark:bg-gray-800 bg-white">
              {/* Line Chart */}
              <Line data={lineChartData} options={options} />
            </div>

            <div className="flex flex-col w-full md:w-2/3 shadow-md p-2 rounded-md dark:bg-gray-800 bg-white">
              {/* Bar Chart */}
              <Bar data={barChartData} options={options} />
            </div>
          </div>
        ) : (
          <p>Loading...</p> // Optional: show a loading indicator
        )}
      </div>
    </div>
  );
}
