import Logo from "./Logo";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { HiChevronDown } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {
  const dropDownItems = [
    { name: "Product 1", path: "#" },
    { name: "Product 2", path: "#" },
    { name: "Product 3", path: "#" },
  ];

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const currentPath = location.pathname;
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [sub, setSub] = useState(false);
  const [subscribed, setsubscribed] = useState(false);

  // useEffect(() => {
  //   const getSub = async () => {
  //     try {
  //       const res = await fetch(`/api/sub/getsubs/${currentUser._id}`, {
  //         method: "GET",
  //       });

  //       if (!res.ok) {
  //         console.log("something went wrong");
  //       } else {
  //         const data = await res.json();
  //         setSub(data);

  //         const today = new Date();
  //         today.setHours(0, 0, 0, 0);

  //         const validUntil = new Date(data.validUntil);
          

  //         if (validUntil > today) {
  //           setsubscribed(true);
  //         } // Set the state with the received data
  //         // console.log("Fetched data:", data); // Debug log for the fetched data
  //       }
  //     } catch (error) {
  //       console.log("Fetch error:", error.message); // Debug log for errors
  //     }
  //   };

  //   getSub();
  // }, []);


  const handleSignout = async () => {
    try {
      const res = await fetch("/api/users/signout", { method: "POST" });
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

  const handleFreeTrialClick = () => {
    if (currentUser) {
      navigate("/freetrial");
    } else {
      navigate("/signin", { state: { from: "/freetrial" } });
    }
  };

  return (
    <Navbar className="px-4 py-4 lg:px-10 lg:py-6 sticky top-0 z-10 backdrop-blur-lg bg-opacity-70">
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="hidden lg:flex items-center gap-8 ml-8">
          <Navbar.Collapse>
            

            <Navbar.Link as={"div"}>
              <Link
                to={"/pricing"}
                className="text-sm font-medium text-dark-blue hover:text-mid-blue"
              >
                Pricing
              </Link>
            </Navbar.Link>

            <Navbar.Link as={"div"}>
              <Link
                to={"/about"}
                className="text-sm font-medium text-dark-blue hover:text-mid-blue"
              >
                About
              </Link>
            </Navbar.Link>
          </Navbar.Collapse>
        </div>

        <Navbar.Toggle />

        <div className="flex gap-4 items-center text-sm lg:flex-nowrap ml-auto">
          {currentUser ? (
            <>
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <>
                    <span className="block text-sm mr-2">
                      Hi, {currentUser.username}
                    </span>
                    <Avatar
                      alt="user"
                      img={currentUser.profilePicture}
                      rounded
                      className="border-blue-500 w-10 h-10 lg:w-12 lg:h-12"
                    />
                  </>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm font-medium truncate">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                {currentUser.userLevel >= 0 && (
                  <>
                    <Link to={"/dashboard?tab=dash"}>
                      <Dropdown.Item>Dashboard</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                  </>
                )}
                <Link to={"/dashboard?tab=profile"}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
              </Dropdown>
            </>
          ) : (
            <span className="flex items-center">
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <Link
                  to={"/signin"}
                  className="text-sm font-medium text-dark-blue hover:text-mid-blue"
                >
                  Log In
                </Link>
              )}
            </span>
          )}

        
          <div className="hidden lg:block">
            {currentPath !== "/freetrial" && (
              <>
                {currentUser ? (
                  currentUser.userLevel === 0 &&
                  currentUser.userTier === 0 && (
                    <Button
                      className="bg-mid-blue"
                      pill
                      onClick={handleFreeTrialClick}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Start free trial"
                      )}
                    </Button>
                  )
                ) : (
                  <Button className="bg-mid-blue" pill>
                    <Link to={"/signin"} state={{ from: "/freetrial" }}>
                      Start free trial
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <Navbar.Collapse>


          {/* Pricing link */}
          <Navbar.Link as={"div"}>
            <Link
              to={"/pricing"}
              className="block mt-4 text-sm font-medium text-dark-blue hover:text-mid-blue"
            >
              Pricing
            </Link>
          </Navbar.Link>

          {/* About link */}
          <Navbar.Link as={"div"}>
            <Link
              to={"/about"}
              className="block mt-4 text-sm font-medium text-dark-blue hover:text-mid-blue"
            >
              About
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
