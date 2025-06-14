import React, { useEffect, useState } from "react";

const DashboardHome = () => {
  const [role, setRole] = useState("student"); // Change to 'staff', 'provost', 'dining' to test

  const [userInfo, setUserInfo] = useState({
    name: "Saki",
    email: "student@sust.com",
    phone: "017XXXXXXXX",
    role: "student",
    bloodGroup: "A+",
    hallId: "Shah Jalal Hall", // Changed from HALL001 to actual hall name
    department: "CSE",
    semester: "7th",
    roomNumber: "210",
    profilePicture: null,
  });

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    // 🔁 Fetch user info from backend API
    /*
    fetch("http://127.0.0.1:8000/api/user-info", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setUserInfo(data));
    */
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // 🔁 API call for changing password
    /*
    fetch("http://127.0.0.1:8000/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(passwords),
    })
      .then(res => res.json())
      .then(data => alert("Password updated successfully!"));
    */
    alert("Password change logic goes here (API to be implemented)");
  };

  const renderDashboard = () => {
    switch (role) {
      case "staff":
        return (
          <div className="space-y-8">
            {/* Common Info */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                <span className="mr-2">👤</span>Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Name:</span> {userInfo.name}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Email:</span> {userInfo.email}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Phone:</span> {userInfo.phone}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Blood Group:</span> {userInfo.bloodGroup}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Hall Name:</span> {userInfo.hallId}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Role:</span> {userInfo.role === "provost" ? "Provost" : "Staff"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "dining":
        return (
          <div className="space-y-8">
            {/* Common Info */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                <span className="mr-2">👤</span>Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Name:</span> {userInfo.name}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Email:</span> {userInfo.email}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Phone:</span> {userInfo.phone}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Blood Group:</span> {userInfo.bloodGroup}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Hall Name:</span> {userInfo.hallId}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Role:</span> {userInfo.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "student":
        return (
          <div className="space-y-8">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-500 text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold">Current Semester</h3>
                <p className="text-4xl font-bold mt-4">{userInfo.semester}</p>
              </div>
              <div className="bg-green-500 text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold">Room Number</h3>
                <p className="text-4xl font-bold mt-4">{userInfo.roomNumber}</p>
              </div>
              <div className="bg-purple-500 text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold">Hall Name</h3>
                <p className="text-4xl font-bold mt-4">{userInfo.hallId}</p>
              </div>
            </div>

            {/* Main Info */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Academic Info */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                  <span className="mr-2">📚</span>Academic Details
                </h3>
                <div className="space-y-4 text-lg">
                  <p className="text-gray-700">
                    <span className="font-medium">Department:</span> {userInfo.department}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Current Year:</span> {Math.ceil(parseInt(userInfo.semester) / 2)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Semester:</span> {userInfo.semester}
                  </p>
                </div>
              </div>

              {/* Residence Info */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-800">
                  <span className="mr-2">🏠</span>Residence Details
                </h3>
                <div className="space-y-4 text-lg">
                  <p className="text-gray-700">
                    <span className="font-medium">Room Number:</span> {userInfo.roomNumber}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Hall Name:</span> {userInfo.hallId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <p>No dashboard data available</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50 p-10">
      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md col-span-1 flex flex-col items-center text-center">
          <div className="w-36 h-36 mb-4">
            <img
              src={userInfo.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-full w-full h-full object-cover border"
            />
          </div>
          <h2 className="text-2xl font-bold mb-1">{userInfo.name}</h2>
          <p className="text-gray-600">📧 {userInfo.email}</p>
          <p className="text-gray-600">📱 {userInfo.phone}</p>
          <p className="text-gray-600">🩸 Blood Group: {userInfo.bloodGroup}</p>
          <p className="text-gray-600">🏛️ Hall ID: {userInfo.hallId}</p>
          <p className="text-gray-600">🔑 Role: {userInfo.role}</p>
          {role === "student" && (
            <>
              <p className="text-gray-600">📘 Department: {userInfo.department}</p>
              <p className="text-gray-600">🎓 Semester: {userInfo.semester}</p>
              <p className="text-gray-600">🏠 Room No: {userInfo.roomNumber}</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="mt-4 text-sm"
          />
        </div>

        {/* Dashboard Content */}
        <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
          <h1 className="text-3xl font-bold mb-4">📊 Dashboard Overview</h1>
          {renderDashboard()}
        </div>
      </div>

      {/* Password Change Form */}
      <div className="max-w-3xl mx-auto bg-white mt-10 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">🔐 Change Password</h2>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardHome;
