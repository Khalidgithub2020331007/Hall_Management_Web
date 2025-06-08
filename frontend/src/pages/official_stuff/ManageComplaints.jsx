import { useEffect, useState } from "react";
import axios from "axios";

const ManageComplaints = () => {
  //   const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("Received");
  const complaints = [
    {
      complain_id: 1,
      complain_tag: "water_supply",
      complain_details: "No water in the bathroom since last night.",
      complain_status: "Received",
      complainant_registration_number: {
        student_name: "Arif Hossain",
        registration_number: "202012345",
        department: "CSE",
        room_number: "A-204",
        phone_number: "01712345678",
      },
    },
    {
      complain_id: 4,
      complain_tag: "water_supply",
      complain_details:
        "No water in the bathroom since last night.hfdhskahfkahdfkljashfkhaskjfhkasjdhfksjhdfklhsakldfhkasdfkjsfkjhsaskfhksajdhfkjasdfkjsakfaskhfh",
      complain_status: "Received",
      complainant_registration_number: {
        student_name: "Arif Hossain",
        registration_number: "202012345",
        department: "CSE",
        room_number: "A-204",
        phone_number: "01712345678",
      },
    },
    {
      complain_id: 4,
      complain_tag: "water_supply",
      complain_details:
        "No water in the bathroom since last night.hfdhskahfkahdfkljashfkhaskjfdfjlskajflkjflkjaljflkasjlfjslkjflakjsflkjsaldfkjasldkfjl;askjdflaskjdflkjasdf;lkjsda;lfhkasjdhfksjhdfklhsakldfhkasdfkjsfkjhsaskfhksajdhfkjasdfkjsakfaskhfh",
      complain_status: "Received",
      complainant_registration_number: {
        student_name: "Arif Hossain",
        registration_number: "202012345",
        department: "CSE",
        room_number: "A-204",
        phone_number: "01712345678",
      },
    },
    {
      complain_id: 2,
      complain_tag: "toilet_clean",
      complain_details: "Toilet not cleaned for three days.",
      complain_status: "In Process",
      complainant_registration_number: {
        student_name: "Nazmul Karim",
        registration_number: "202045678",
        department: "EEE",
        room_number: "B-305",
        phone_number: "01898765432",
      },
    },
    {
      complain_id: 3,
      complain_tag: "bed",
      complain_details: "Broken bed, unable to sleep properly.",
      complain_status: "Resolved",
      complainant_registration_number: {
        student_name: "Fahim Rahman",
        registration_number: "202078910",
        department: "ME",
        room_number: "C-102",
        phone_number: "01987654321",
      },
    },
  ];

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/complain/complain/");
      //   setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/complain/complain/${id}/`, {
        complain_status: newStatus,
      });
      fetchComplaints(); // Refresh data after update
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredComplaints = complaints.filter(
    (c) => c.complain_status === filter
  );

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6">
        {["Received", "In Process", "Resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn ${
              filter === status ? "btn-primary" : "btn-outline"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredComplaints.length === 0 ? (
        <p>No complaints in this category.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.complain_id} className="card w-full max-w-md p-4 shadow-md h-80 flex flex-col justify-between ">
              <h3 className="text-lg font-bold capitalize mb-2">
                {complaint.complain_tag.replaceAll("_", " ")}
              </h3>
              <p className="text-gray-700 mb-2 max-h-32 overflow-y-auto pr-2">
                {complaint.complain_details}
              </p>

              <div className="text-sm mb-2">
                <p>
                  <strong>Name:</strong>{" "}
                  {complaint.complainant_registration_number?.student_name}
                </p>
                <p>
                  <strong>Reg No:</strong>{" "}
                  {
                    complaint.complainant_registration_number
                      ?.registration_number
                  }
                </p>
                <p>
                  <strong>Dept:</strong>{" "}
                  {complaint.complainant_registration_number?.department}
                </p>
                <p>
                  <strong>Room:</strong>{" "}
                  {complaint.complainant_registration_number?.room_number}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {complaint.complainant_registration_number?.phone_number}
                </p>
              </div>

              {filter !== "Resolved" && (
                <div className="mt-2 flex gap-2">
                  {filter === "Received" && (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() =>
                        handleStatusChange(complaint.complain_id, "In Process")
                      }
                    >
                      Mark as In Process
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      handleStatusChange(complaint.complain_id, "Resolved")
                    }
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;
