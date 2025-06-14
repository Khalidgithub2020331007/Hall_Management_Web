import { useState, useEffect } from "react";
import axios from "axios";
import ComplaintFormModal from "../../components/ComplaintFormModal";

const BASE_URL = "http://127.0.0.1:8000/complain/make_complaints/";

const Complaints = () => {
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setComplaints(res.data.results); // Use results array from paginated response
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  const handleDelete = async (complainId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}${complainId}/`);
      fetchComplaints(); // Refresh list after deletion
    } catch (err) {
      console.error("Failed to delete complaint", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
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
          {complaints.map((complaint) => {
            const status = complaint.complain_status.toLowerCase();

            const badgeClass =
              status === "received"
                ? "badge-warning"
                : status === "in process"
                ? "badge-info"
                : status === "resolved"
                ? "badge-success"
                : "badge-default";

            return (
              <div
                key={complaint.complain_id}
                className="card p-4 shadow-md w-full"
              >
                <h3 className="font-bold capitalize">
                  {complaint.complain_tag.replaceAll("_", " ")}
                </h3>
                <p>{complaint.complain_details}</p>
                <p className="text-sm text-gray-600">
                  By: {complaint.complainant_name || "Unknown"}
                </p>
                <p className={`text-sm font-semibold mt-2 badge ${badgeClass}`}>
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
            );
          })}
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
