import React, { useState, useEffect } from "react";
import axios from "axios";

const truncateText = (text, limit = 6) => {
  if (!text) return "";
  if (text.split(" ").length <= limit) return text;
  return text.split(" ").slice(0, limit).join(" ") + "...";
};

const HallApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [allocatedSeats, setAllocatedSeats] = useState({});

  const [halls, setHalls] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Fetch halls
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/halls_and_rooms/hall/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setHalls(data);
      })
      .catch((err) => console.error("Error fetching halls:", err));
  }, []);

  // Fetch rooms
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/halls_and_rooms/room/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setRooms(data);
      })
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  // Fetch applications
  useEffect(() => {
    fetch("http://127.0.0.1:8000/student_admission/application/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        setApplications(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching applications");
        setLoading(false);
      });
  }, []);

  // Group applications by department + session
  const grouped = applications.reduce((acc, app) => {
    const key = `${app.department_name} | ${app.session}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(app);
    return acc;
  }, {});

  // Sort grouped applications
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => {
      if (sortBy === "cgpa") return b.cgpa - a.cgpa;
      if (sortBy === "last_semester_gpa") return b.last_semester_gpa - a.last_semester_gpa;
      if (sortBy === "distance")
        return a.home_distance_from_SUST_in_km - b.home_distance_from_SUST_in_km;
      if (sortBy === "income") return a.family_monthly_income - b.family_monthly_income;
      return 0;
    });
  });

  // Handle allocation: send PATCH request to backend
  const handleAllocate = () => {
    if (!selectedApplicant || !selectedHall || !selectedRoom) {
      alert("Please select applicant, hall, and room.");
      return;
    }

    // IMPORTANT: Use admission ID, not registration number for URL
    const admissionId = selectedApplicant.admission; // <-- make sure this field exists and holds PK

    if (!admissionId) {
      alert("Admission ID missing. Cannot allocate seat.");
      console.error("Selected applicant admission ID missing:", selectedApplicant);
      return;
    }

    const payload = {
      hall: parseInt(selectedHall),
      room_number: selectedRoom,
    };

    console.log("handleAllocate called");
    console.log("Sending PATCH to:", `http://127.0.0.1:8000/student_admission/admission/${admissionId}/`);
    console.log("Payload:", payload);

    axios
      .patch(`http://127.0.0.1:8000/student_admission/admission/${admissionId}/`, payload)
      .then((res) => {
        console.log("Allocation successful:", res.data);
        setAllocatedSeats((prev) => ({
          ...prev,
          [selectedApplicant.registration_number]: {
            hall: halls.find((h) => h.hall_id === parseInt(selectedHall))?.hall_name || "",
            room: selectedRoom,
          },
        }));
        setRoomDialogOpen(false);
        setSelectedApplicant(null);
        setSelectedHall("");
        setSelectedRoom("");
      })
      .catch((error) => {
        console.error("Error allocating seat:", error);
        alert("Failed to allocate seat. See console for details.");
      });
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Hall Applicants</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by:</label>
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered text-blue-700 bg-yellow-100"
          defaultValue=""
        >
          <option key="default" value="">
            Default
          </option>
          <option key="cgpa" value="cgpa">
            CGPA (High → Low)
          </option>
          <option key="last_gpa" value="last_semester_gpa">
            Last GPA (High → Low)
          </option>
          <option key="distance" value="distance">
            Home Distance (Low → High)
          </option>
          <option key="income" value="income">
            Family Income (Low → High)
          </option>
        </select>
      </div>

      {Object.entries(grouped).map(([groupKey, apps]) => (
        <div key={groupKey} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{groupKey}</h3>

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
                          onClick={() => setSelectedReason(app.special_reason_for_hall_seat)}
                          className="text-blue-600 underline"
                        >
                          {truncateText(app.special_reason_for_hall_seat)}
                        </button>
                      ) : (
                        app.special_reason_for_hall_seat || "N/A"
                      )}
                    </td>
                    <td>
                      {app.total_credits_offered} / {app.total_credits_completed}
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
                                const hallObj = halls.find(
                                  (h) =>
                                    h.hall_name ===
                                    allocatedSeats[app.registration_number].hall
                                );
                                setSelectedHall(hallObj?.hall_id.toString() || "");
                                setSelectedRoom(allocatedSeats[app.registration_number].room);
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

      {/* Reason Modal */}
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

      {/* Allocate Room Modal */}
      {roomDialogOpen && selectedApplicant && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm bg-white text-black shadow-xl rounded-xl">
            <h3 className="font-bold text-lg mb-4">
              Allocate Seat for {selectedApplicant.name}
            </h3>

            {/* Hall Selection */}
            <div className="mb-2">
              <label className="label">Hall</label>
              <select
                value={selectedHall}
                onChange={(e) => {
                  setSelectedHall(e.target.value);
                  setSelectedRoom("");
                }}
                className="select select-bordered w-full bg-white text-black"
              >
                <option key="hall-default" value="">
                  Select Hall
                </option>
                {halls.map((hall) => (
                  <option key={`hall-${hall.hall_id}`} value={hall.hall_id.toString()}>
                    {hall.hall_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Selection */}
            <div className="mb-4">
              <label className="label">Available Rooms</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="select select-bordered w-full bg-white text-black"
                disabled={!selectedHall}
              >
                <option key="room-default" value="">
                  Select Room
                </option>
                {rooms
                  .filter((room) => room.hall === parseInt(selectedHall))
                  .map((room) => (
                    <option key={`room-${room.room_id}`} value={room.room_number}>
                      {room.room_number}
                    </option>
                  ))}
              </select>
            </div>

            {/* Modal Actions */}
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
