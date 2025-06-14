import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const currentUser = {
  name: "John Doe",
  designation: "provost", // Change to test roles
};

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTopicTexts, setNewTopicTexts] = useState({});
  const [showTopicInputs, setShowTopicInputs] = useState({});
  const [formData, setFormData] = useState({
    meeting_date_time: "",
    meeting_members: "",
    meeting_description: "",
    meeting_decision: "",
    meeting_minutes: "",
    next_meeting_date_time: "",
  });

  const fetchMeetings = async () => {
    try {
      const [meetingsRes, topicsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/meetings/meetings/"),
        axios.get("http://127.0.0.1:8000/meetings/topics/"),
      ]);
      setMeetings(meetingsRes.data.results || []);
      setTopics(topicsRes.data.results || []);
    } catch (err) {
      console.error("Failed to fetch meetings or topics", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const newMeeting = {
      ...formData,
      meeting_chairperson: 2, // Replace with actual user logic
    };

    try {
      await axios.post("http://127.0.0.1:8000/meetings/meetings/", newMeeting);
      setFormData({
        meeting_date_time: "",
        meeting_members: "",
        meeting_description: "",
        meeting_decision: "",
        meeting_minutes: "",
        next_meeting_date_time: "",
      });
      setShowForm(false);
      fetchMeetings();
    } catch (err) {
      console.error("Failed to create meeting", err);
    }
  };

  const handleAddTopicClick = (meetingId) => {
    setShowTopicInputs((prev) => ({ ...prev, [meetingId]: true }));
  };

  const handleTopicChange = (meetingId, value) => {
    setNewTopicTexts((prev) => ({ ...prev, [meetingId]: value }));
  };

  const handleSaveTopic = async (meetingId) => {
    const topicText = newTopicTexts[meetingId];
    if (!topicText || topicText.trim() === "") {
      alert("Topic text cannot be empty.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/meetings/topics/", {
        meeting: meetingId,
        topic_text: topicText.trim(),
      });
      alert("Topic added successfully.");
      setNewTopicTexts((prev) => ({ ...prev, [meetingId]: "" }));
      setShowTopicInputs((prev) => ({ ...prev, [meetingId]: false }));
      fetchMeetings(); // Refresh list
    } catch (error) {
      console.error("Error adding topic:", error);
      alert("Failed to add topic.");
    }
  };

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
            type="datetime-local"
            name="meeting_date_time"
            className="input input-bordered w-full bg-white"
            value={formData.meeting_date_time}
            onChange={(e) =>
              setFormData({ ...formData, meeting_date_time: e.target.value })
            }
            required
          />
          <input
            type="text"
            name="meeting_members"
            className="input input-bordered w-full bg-white"
            placeholder="Meeting Members"
            value={formData.meeting_members}
            onChange={(e) =>
              setFormData({ ...formData, meeting_members: e.target.value })
            }
            required
          />
          <textarea
            name="meeting_description"
            className="textarea textarea-bordered w-full bg-white"
            placeholder="Description"
            value={formData.meeting_description}
            onChange={(e) =>
              setFormData({ ...formData, meeting_description: e.target.value })
            }
            required
          />
          <textarea
            name="meeting_decision"
            className="textarea textarea-bordered w-full bg-white"
            placeholder="Decision"
            value={formData.meeting_decision}
            onChange={(e) =>
              setFormData({ ...formData, meeting_decision: e.target.value })
            }
          />
          <textarea
            name="meeting_minutes"
            className="textarea textarea-bordered w-full bg-white"
            placeholder="Minutes"
            value={formData.meeting_minutes}
            onChange={(e) =>
              setFormData({ ...formData, meeting_minutes: e.target.value })
            }
          />
          <input
            type="datetime-local"
            name="next_meeting_date_time"
            className="input input-bordered w-full bg-white"
            value={formData.next_meeting_date_time}
            onChange={(e) =>
              setFormData({
                ...formData,
                next_meeting_date_time: e.target.value,
              })
            }
          />

          <div className="flex">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            <button
              type="button"
              className="btn btn-outline ml-2"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  meeting_date_time: "",
                  meeting_members: "",
                  meeting_description: "",
                  meeting_decision: "",
                  meeting_minutes: "",
                  next_meeting_date_time: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Meetings List</h3>
        {meetings.length === 0 ? (
          <p>No meetings available.</p>
        ) : (
          <div className="grid gap-4">
            {meetings.map((meeting) => {
              const meetingTopics = topics.filter(
                (t) => t.meeting === meeting.meeting_id
              );

              return (
                <div key={meeting.meeting_id} className="card bg-amber-200 p-4 shadow">
                  <h4 className="text-lg font-bold">
                    {format(new Date(meeting.meeting_date_time), "PPpp")}
                  </h4>
                  <p><strong>Members:</strong> {meeting.meeting_members}</p>
                  <p><strong>Description:</strong> {meeting.meeting_description}</p>
                  <p><strong>Decision:</strong> {meeting.meeting_decision}</p>
                  <p><strong>Minutes:</strong> {meeting.meeting_minutes}</p>
                  <p><strong>Next Meeting:</strong> {format(new Date(meeting.next_meeting_date_time), "PPpp")}</p>

                  {meetingTopics.length > 0 && (
                    <div>
                      <strong>Topics:</strong>
                      <ul className="list-disc pl-5">
                        {meetingTopics.map((topic) => (
                          <li key={topic.id}>{topic.topic_text}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Add Topic Feature */}
                  {showTopicInputs[meeting.meeting_id] ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newTopicTexts[meeting.meeting_id] || ""}
                        onChange={(e) =>
                          handleTopicChange(meeting.meeting_id, e.target.value)
                        }
                        placeholder="Enter topic"
                        className="input input-bordered w-full bg-white"
                      />
                      <button
                        onClick={() => handleSaveTopic(meeting.meeting_id)}
                        className="btn btn-success"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddTopicClick(meeting.meeting_id)}
                      className="btn btn-info mt-2"
                    >
                      Add Topic
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
