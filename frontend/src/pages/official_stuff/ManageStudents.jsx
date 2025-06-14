import React, { useEffect, useState } from "react";

const hardcodedStudents = [
  {
    id: 1,
    registration_number: "2023001",
    name: "Fuad Alamin",
    room: "101",
    hall: "Shahidul Hall",
    image: "https://via.placeholder.com/100",
    phone: "01710000000",
    email: "fuad@example.com",
    department: "CSE",
    address: "Sylhet Sadar",
  },
  {
    id: 2,
    registration_number: "2023002",
    name: "Nahid Hossain",
    room: "101",
    hall: "Shahidul Hall",
    image: "https://via.placeholder.com/100",
    phone: "01711111111",
    email: "nahid@example.com",
    department: "CSE",
    address: "Sunamganj",
  },
  {
    id: 3,
    registration_number: "2023003",
    name: "Sarah Akter",
    room: "102",
    hall: "Shahidul Hall",
    image: "https://via.placeholder.com/100",
    phone: "01812223344",
    email: "sarah@example.com",
    department: "EEE",
    address: "Moulvibazar",
  },
];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [assignedHall, setAssignedHall] = useState("Shahidul Hall"); // hardcoded hall
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch assigned hall for staff
    // axios.get('/api/assigned-hall/').then(res => setAssignedHall(res.data.hall));
    setAssignedHall("Shahidul Hall");

    // Simulate API call to fetch students
    // axios.get('/api/students/').then(res => setStudents(res.data));
    setStudents(hardcodedStudents);
  }, []);

  const filteredStudents = students.filter((student) => {
    return (
      student.hall === assignedHall &&
      (student.registration_number.includes(searchTerm) ||
        student.room.includes(searchTerm))
    );
  });

  const groupedByRoom = filteredStudents.reduce((acc, student) => {
    if (!acc[student.room]) acc[student.room] = [];
    acc[student.room].push(student);
    return acc;
  }, {});

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">
        Manage Students - {assignedHall}
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Reg. No or Room"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md bg-base-content border-base-100"
        />
      </div>

      {/* Student Detail View */}
      {selectedStudent && (
        <div className="card shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <img
              src={selectedStudent.photo_url}
              alt="Student"
              className="w-28 h-28 rounded object-cover border"
            />
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {selectedStudent.name} ({selectedStudent.registration_number})
              </h3>
              <p>Email: {selectedStudent.email}</p>
              <p>Phone: {selectedStudent.phone_number}</p>
              <p>Department: {selectedStudent.department_name}</p>
              <p>Room: {selectedStudent.room}</p>
              <p>Semester: {selectedStudent.semester}</p>
              <p>Address: {selectedStudent.permanent_address}</p>
              {/* Add more fields as needed */}
              <button
                className="btn btn-sm mt-2"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {Object.keys(groupedByRoom).length > 0 ? (
        Object.entries(groupedByRoom).map(([room, students]) => (
          <div key={room} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Room {room}</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="table w-full">
                <thead>
                  <tr className="text-base-100">
                    <th>Reg. No</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="cursor-pointer odd:bg-red even:bg-blue"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td>{student.registration_number}</td>
                      <td>{student.name}</td>
                      <td>{student.phone}</td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p>No students found for this hall.</p>
      )}
    </div>
  );
};

export default ManageStudents;