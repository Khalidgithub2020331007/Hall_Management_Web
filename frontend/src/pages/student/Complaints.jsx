import { useState, useEffect } from "react";
import axios from "axios";
import ComplaintFormModal from "../../components/ComplaintFormModal";

const Complaints = () => {
  //   const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([
    {
      complain_id: 999,
      complain_tag: "electric",
      complain_details: "The fan in my room isn't working since last night.",
      complain_status: "Received",
      complain_date: "2025-06-01",
    },
    {
      complain_id: 998,
      complain_tag: "electric",
      complain_details: "The fan in my room isn't working since last night.",
      complain_status: "In Process",
      complain_date: "2025-06-01",
    },
  ]);

  //   const fetchComplaints = async () => {
  //     try {
  //       const res = await axios.get("http://127.0.0.1:8000/complain/complain/");
  //       setComplaints(res.data);
  //     } catch (err) {
  //       console.error("Failed to load complaints", err);
  //     }
  //   };

  const handleDelete = async (complainId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/complain/complain/${complainId}/`
      );
      //   fetchComplaints(); // Refresh after deletion
    } catch (err) {
      console.error("Failed to delete complaint", err);
    }
  };

  useEffect(() => {
    // fetchComplaints();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Complaints</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Any Complaint?
        </button>
      </div>

      {Array.isArray(complaints) && complaints.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.complain_id}
              className="card p-4 shadow-md w-full"
            >
              <h3 className="font-bold capitalize">
                {complaint.complain_tag.replaceAll("_", " ")}
              </h3>
              <p>{complaint.complain_details}</p>
              <p
                className={`text-sm font-semibold mt-2 badge ${
                  complaint.complain_status === "Received"
                    ? "badge-warning"
                    : complaint.complain_status === "In Process"
                    ? "badge-info"
                    : "badge-success"
                }`}
              >
                {complaint.complain_status}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Date: {complaint.complain_date}
              </p>
              <button
                onClick={() => handleDelete(complaint.complain_id)}
                className="btn btn-sm btn-error mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints found.</p>
      )}

      {showModal && (
        <ComplaintFormModal
          onClose={() => setShowModal(false)}
          onSubmitSuccess={fetchComplaints}
        />
      )}
    </div>
  );
};

export default Complaints;
