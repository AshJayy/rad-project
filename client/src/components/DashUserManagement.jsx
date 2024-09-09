import { Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Import close icon
import { set } from "mongoose";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for the modal
  const [userLimit, setUserLimit] = useState(5);
  const [totalUsers, setTotalUsers] = useState(null);

  // setUserLimit(5);

  useEffect(() => {
    const fetchLimitUsers = async () => {
      try {
        
        const res = await fetch(`/api/users/getusers?limit=${userLimit}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          // console.log(totalUsers);

          if (data.users.length < totalUsers) {
            setShowMore(true);
            setUserLimit((prev) => prev + 5)
          } else {
            setShowMore(false);
          }
          
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLimitUsers();
    
  }, [currentUser._id,totalUsers]);

  const handleShowMore = async () => {
        // console.log(userLimit);
    
    const res = await fetch(`/api/users/getusers?limit=${userLimit}`);
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      // setUserLimit(data.users.length);
      // console.log("hello");
      console.log(data.users);
      
      if (data.users.length < totalUsers) {
        setShowMore(true);
        setUserLimit((prev) => prev + 5)
      } else {
        setShowMore(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/users/delete/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        setSelectedUser(null); // Close the modal
      } else {
        console.log(await res.json());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMakeUserAsAdmin = async (userId) => {
    try {
      const res = await fetch(`/api/users/makeadmin/${userId}`, {
        method: "PUT",
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, userLevel: 1 } : user
          )
        );
        setSelectedUser(null); // Close the modal
      } else {
        console.log(await res.json());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Modal Component
  const Modal = ({ user, onClose, onMakeAdmin, onDelete }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-gray-500 opacity-50"
          onClick={onClose}
        ></div>
        <div className="relative bg-white dark:bg-gray-800 p-20 rounded-lg shadow-lg z-10">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <IoClose className="w-6 h-6" />
          </button>
          <div className="text-center">
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-20 h-20 object-cover bg-gray-500 rounded-full mx-auto mb-4"
            />
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user.username}
            </h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
            <div className="flex flex-col gap-2">
              {user.userLevel === 0 ? (
                <Button
                  className="bg-mid-blue hover:bg-dark-blue text-white py-2 px-4 rounded"
                  onClick={() => {
                    onMakeAdmin(user._id);
                    onClose();
                  }}
                >
                  Make Admin
                </Button>
              ) : (
                <h3 className="bg-mid-blue text-white py-4 px-4 rounded-md">
                  User is an admin
                </h3>
              )}

              <span
                onClick={() => {
                  onDelete(user._id);
                  onClose();
                }}
                className="text-red-500 hover:text-red-600 cursor-pointer underline"
              >
                Delete User
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.userLevel > 0 && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.userLevel > 0 ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => setSelectedUser(user)}
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      {selectedUser && (
        <Modal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMakeAdmin={handleMakeUserAsAdmin}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}
