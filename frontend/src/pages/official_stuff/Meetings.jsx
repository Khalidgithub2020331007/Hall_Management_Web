import { useEffect, useState } from "react";
// import axios from "axios";
import { format } from "date-fns";

const currentUser = {
  name: "John Doe",
  designation: "provost", // Change this to 'dining_manager' to test different roles
};

const dummyMeetings = [
  {
    id: 1,
    title: "Dining Budget Review",
    description: "Discuss this month's expenses.",
    date: "2025-06-07T10:00",
    attendees: ["assistant provost"],
    outcome: "",
    host: "John Doe",
  },
  {
    id: 2,
    title: "Room Allocation Planning",
    description: "Talk about new batch arrangements.",
    date: "2025-06-06T15:00",
    attendees: ["computer operator"],
    outcome: "Decided to allocate rooms in block C.",
    host: "Alice",
  },
];

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    attendees: [],
  });
  const [editingOutcomeId, setEditingOutcomeId] = useState(null);
  const [editedOutcome, setEditedOutcome] = useState("");

  const fetchMeetings = async () => {
    try {
      // const res = await axios.get("/api/meetings");
      // setMeetings(res.data);
      setMeetings(dummyMeetings); // hardcoded for UI
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const newMeeting = { ...formData, host: currentUser.name, outcome: "" };

    try {
      // await axios.post("/api/meetings", newMeeting);
      setMeetings([...meetings, { ...newMeeting, id: Date.now() }]);
      setFormData({ title: "", description: "", date: "", attendees: [] });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create meeting", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      // await axios.delete(`/api/meetings/${id}`);
      setMeetings(meetings.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete meeting", err);
    }
  };

  const handleOutcomeUpdate = async (id, newOutcome) => {
    try {
      // await axios.put(`/api/meetings/${id}/`, { outcome: newOutcome });
      setMeetings(
        meetings.map((m) => (m.id === id ? { ...m, outcome: newOutcome } : m))
      );
    } catch (err) {
      console.error("Failed to update outcome", err);
    }
  };

  const isUpcoming = (dateStr) => new Date(dateStr) > new Date();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    const meetingDate = new Date(m.date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(today.getDate() - 8);

    if (currentUser.designation === "dining_manager") {
      return (
        meetingDate.toDateString() === today.toDateString() ||
        meetingDate.toDateString() === yesterday.toDateString()
      );
    } else {
      return meetingDate >= eightDaysAgo;
    }
  });

  const upcomingMeetings = filteredMeetings.filter((m) => isUpcoming(m.date));
  const pastMeetings = filteredMeetings
    .filter((m) => !isUpcoming(m.date))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Meetings</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Create Meeting
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateMeeting}
          className="card bg-amber-200 p-4 shadow-md space-y-4 mb-6"
        >
          <input
            name="title"
            placeholder="Meeting Title"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            name="description"
            placeholder="Meeting Description"
            className="textarea textarea-bordered w-full"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <input
            type="datetime-local"
            name="date"
            className="input input-bordered w-full"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline w-full justify-start"
            >
              {formData.attendees.length > 0
                ? formData.attendees.join(", ")
                : "Select Attendees"}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {["provost", "assistant provost", "computer operator", "all"].map(
                (role) => (
                  <li key={role}>
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm mr-2"
                        checked={formData.attendees.includes(role)}
                        onChange={() => {
                          const newAttendees = formData.attendees.includes(role)
                            ? formData.attendees.filter((r) => r !== role)
                            : [...formData.attendees, role];
                          setFormData({ ...formData, attendees: newAttendees });
                        }}
                      />
                      <span className="label-text capitalize">{role}</span>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="flex">
            <button className="btn btn-primary" type="submit">
              Schedule
            </button>
            <button
              type="button"
              className="btn btn-outline ml-2"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  title: "",
                  description: "",
                  date: "",
                  attendees: [],
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Upcoming Meetings</h3>
        {upcomingMeetings.length > 0 ? (
          <div className="grid gap-4 mb-6">
            {upcomingMeetings.map((m) => (
              <div key={m.id} className="card bg-amber-200 shadow p-4">
                <h4 className="text-lg font-bold">{m.title}</h4>
                <p>{m.description}</p>
                <p className="text-sm text-gray-500">
                  Date: {format(new Date(m.date), "PPpp")}
                </p>
                <p className="text-sm text-gray-500">
                  Attendees: {m.attendees.join(", ")}
                </p>
                <p className="text-sm text-gray-500">Host: {m.host}</p>
                {m.host === currentUser.name && (
                  <button
                    className="btn btn-sm btn-error mt-2"
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming meetings</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Past 7 Days</h3>
        {pastMeetings.length > 0 ? (
          <div className="grid gap-4">
            {pastMeetings.map((m) => (
              <div key={m.id} className="card bg-amber-200 shadow p-4">
                <h4 className="text-lg font-bold">{m.title}</h4>
                <p>{m.description}</p>
                <p className="text-sm text-gray-500">
                  Date: {format(new Date(m.date), "PPpp")}
                </p>
                <p className="text-sm text-gray-500">
                  Attendees: {m.attendees.join(", ")}
                </p>
                <p className="text-sm text-gray-500">Host: {m.host}</p>

                <div className="mt-2">
                  <p className="font-semibold">Outcome:</p>
                  {m.outcome && <p>{m.outcome}</p>}

                  {m.host === currentUser.name && (
                    <div className="mt-2 space-y-2">
                      {editingOutcomeId === m.id ? (
                        <>
                          <textarea
                            className="textarea textarea-bordered w-full"
                            value={editedOutcome}
                            onChange={(e) => setEditedOutcome(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                handleOutcomeUpdate(m.id, editedOutcome);
                                setEditingOutcomeId(null);
                                setEditedOutcome("");
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                setEditingOutcomeId(null);
                                setEditedOutcome("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => {
                            setEditingOutcomeId(m.id);
                            setEditedOutcome(m.outcome);
                          }}
                        >
                          {m.outcome ? "Edit Outcome" : "Add Outcome"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No past meetings</p>
        )}
      </div>
    </div>
  );
};

export default Meetings;
