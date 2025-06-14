import React, { useState, useEffect } from "react";

const hardcodedApplications = [
  {
    registration_number: "2023001",
    name: "Fuad Alamin",
    phone_number: "01710000000",
    email: "fuad@example.com",
    department_name: "CSE",
    study_program: "Undergraduate",
    session: "2019-20",
    semester: "8th",
    permanent_address: "Sylhet Sadar",
    home_distance_from_SUST_in_km: 15.3,
    family_monthly_income: 25000,
    special_reason_for_hall_seat:
      "Financial issues due to family hardship and long distance from campus making it hard to commute daily.",
    total_credits_offered: 120,
    total_credits_completed: 100,
    cgpa: 3.75,
    last_semester_gpa: 3.9,
  },
  {
    registration_number: "2023002",
    name: "Nahid Hossain",
    phone_number: "01711111111",
    email: "nahid@example.com",
    department_name: "CSE",
    study_program: "Undergraduate",
    session: "2019-20",
    semester: "8th",
    permanent_address: "Sunamganj",
    home_distance_from_SUST_in_km: 50,
    family_monthly_income: 18000,
    special_reason_for_hall_seat:
      "Lives far from campus with no nearby housing options.",
    total_credits_offered: 120,
    total_credits_completed: 110,
    cgpa: 3.82,
    last_semester_gpa: 3.95,
  },
  {
    registration_number: "2023003",
    name: "Sarah Akter",
    phone_number: "01812223344",
    email: "sarah@example.com",
    department_name: "EEE",
    study_program: "Undergraduate",
    session: "2020-21",
    semester: "6th",
    permanent_address: "Moulvibazar",
    home_distance_from_SUST_in_km: 35,
    family_monthly_income: 30000,
    special_reason_for_hall_seat: "",
    total_credits_offered: 90,
    total_credits_completed: 80,
    cgpa: 3.76,
    last_semester_gpa: 3.94,
  },
];

const truncateText = (text, limit = 6) => {
  if (!text || text.split(" ").length <= limit) return text;
  return text.split(" ").slice(0, limit).join(" ") + "...";
};

const HallApplicants = () => {
  const [sortBy, setSortBy] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [allocatedSeats, setAllocatedSeats] = useState({});

  const halls = ["Shahidul Hall", "TSC Hall"];
  const rooms = {
    "Shahidul Hall": ["101", "102"],
    "TSC Hall": ["201", "202"],
  };

  const grouped = hardcodedApplications.reduce((acc, app) => {
    const key = `${app.department_name} | ${app.session}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(app);
    return acc;
  }, {});

  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => {
      if (sortBy === "cgpa") return b.cgpa - a.cgpa;
      if (sortBy === "last_semester_gpa")
        return b.last_semester_gpa - a.last_semester_gpa;
      if (sortBy === "distance")
        return (
          a.home_distance_from_SUST_in_km - b.home_distance_from_SUST_in_km
        );
      if (sortBy === "income")
        return a.family_monthly_income - b.family_monthly_income;
      return 0;
    });
  });

  const handleAllocate = () => {
    if (!selectedApplicant || !selectedHall || !selectedRoom) return;

    setAllocatedSeats((prev) => ({
      ...prev,
      [selectedApplicant.registration_number]: {
        hall: selectedHall,
        room: selectedRoom,
      },
    }));

    setRoomDialogOpen(false);
    setSelectedApplicant(null);
    setSelectedHall("");
    setSelectedRoom("");
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Hall Applicants</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by:</label>
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered"
          defaultValue=""
        >
          <option value="">Default</option>
          <option value="cgpa">CGPA (High → Low)</option>
          <option value="last_semester_gpa">Last GPA (High → Low)</option>
          <option value="distance">Home Distance (Low → High)</option>
          <option value="income">Family Income (Low → High)</option>
        </select>
      </div>

      {Object.entries(grouped).map(([group, apps]) => (
        <div key={group} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{group}</h3>

          <div className="overflow-x-auto border rounded-lg">
            <table className="table table-zebra w-full min-w-[1200px]">
              <thead>
                <tr>
                  <th>Reg. No</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Study Program</th>
                  <th>Semester</th>
                  <th>Address</th>
                  <th>Distance (km)</th>
                  <th>Family Income</th>
                  <th>Reason</th>
                  <th>Credits (Off / Comp)</th>
                  <th>CGPA</th>
                  <th>Last GPA</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.registration_number}>
                    <td>{app.registration_number}</td>
                    <td>{app.name}</td>
                    <td>{app.phone_number}</td>
                    <td>{app.email}</td>
                    <td>{app.department_name}</td>
                    <td>{app.study_program}</td>
                    <td>{app.semester}</td>
                    <td>{app.permanent_address}</td>
                    <td>{app.home_distance_from_SUST_in_km}</td>
                    <td>{app.family_monthly_income}</td>
                    <td>
                      {app.special_reason_for_hall_seat &&
                      app.special_reason_for_hall_seat.split(" ").length > 6 ? (
                        <button
                          onClick={() => {
                            setSelectedReason(app.special_reason_for_hall_seat);
                          }}
                          className="text-blue-600 underline"
                        >
                          {truncateText(app.special_reason_for_hall_seat)}
                        </button>
                      ) : (
                        app.special_reason_for_hall_seat || "N/A"
                      )}
                    </td>
                    <td>
                      {app.total_credits_offered} /{" "}
                      {app.total_credits_completed}
                    </td>
                    <td>{app.cgpa}</td>
                    <td>{app.last_semester_gpa}</td>
                    <td>
                      {allocatedSeats[app.registration_number] ? (
                        <div>
                          <div className="text-sm font-medium">
                            <span className="text-green-600">Allocated:</span>{" "}
                            {allocatedSeats[app.registration_number].hall} - Room{" "}
                            {allocatedSeats[app.registration_number].room}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <button
                              className="btn btn-xs btn-outline btn-info"
                              onClick={() => {
                                setSelectedApplicant(app);
                                setSelectedHall(
                                  allocatedSeats[app.registration_number].hall
                                );
                                setSelectedRoom(
                                  allocatedSeats[app.registration_number].room
                                );
                                setRoomDialogOpen(true);
                              }}
                            >
                              Change
                            </button>
                            <button
                              className="btn btn-xs btn-outline btn-error"
                              onClick={() => {
                                setAllocatedSeats((prev) => {
                                  const updated = { ...prev };
                                  delete updated[app.registration_number];
                                  return updated;
                                });
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedApplicant(app);
                            setSelectedHall("");
                            setSelectedRoom("");
                            setRoomDialogOpen(true);
                          }}
                        >
                          Allocate Seat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {selectedReason && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg mb-2">Special Reason</h3>
            <p className="whitespace-pre-line">{selectedReason}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedReason("")}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {roomDialogOpen && selectedApplicant && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4">
              Allocate Seat for {selectedApplicant.name}
            </h3>
            <div className="mb-2">
              <label className="label">Hall</label>
              <select
                value={selectedHall}
                onChange={(e) => {
                  setSelectedHall(e.target.value);
                  setSelectedRoom("");
                }}
                className="select select-bordered w-full"
              >
                <option value="">Select Hall</option>
                {halls.map((hall) => (
                  <option key={hall} value={hall}>
                    {hall}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="label">Available Rooms</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="select select-bordered w-full"
                disabled={!selectedHall}
              >
                <option value="">Select Room</option>
                {selectedHall &&
                  rooms[selectedHall]?.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
              </select>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-secondary"
                onClick={() => setRoomDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!selectedRoom}
                onClick={handleAllocate}
              >
                Confirm
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default HallApplicants;
