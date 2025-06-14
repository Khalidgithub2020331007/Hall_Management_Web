import { useState } from "react";
import axios from "axios";

const ComplaintFormModal = ({ onClose, onSubmitSuccess }) => {
  const [tag, setTag] = useState("");
  const [details, setDetails] = useState("");

  const registrationNumber = localStorage.getItem("registrationNumber");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/complain/make_complaints/", {
        complainant_registration_number: registrationNumber,
        complain_tag: tag,
        complain_details: details,
      });
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to submit complaint:", error.response?.data);
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box bg-gray-100 text-gray-800">
        <h3 className="font-bold text-lg">Submit a Complaint</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <select
            className="select w-full bg-gray-50 text-gray-800 border border-gray-300 rounded"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
          >
            <option disabled value="">
              Select a tag
            </option>
            <option value="water_supply">Water Supply</option>
            <option value="room_clean">Room Clean</option>
            <option value="toilet_clean">Toilet Clean</option>
            <option value="bathroom">Bathroom</option>
            <option value="electric">Electric</option>
            <option value="dining">Dining</option>
            <option value="shop">Shop</option>
            <option value="canteen">Canteen</option>
            <option value="wi_fi">Wi-Fi</option>
            <option value="reading_room">Reading Room</option>
            <option value="drainage_system">Drainage System</option>
            <option value="bed">Bed</option>
            <option value="locker">Locker</option>
            <option value="window_glass">Window Glass</option>
            <option value="mosquito_net_stand">Mosquito Net Stand</option>
            <option value="administrative">Administrative</option>
            <option value="others">Others</option>
          </select>

          <textarea
            className="textarea w-full bg-gray-50 text-gray-800 border border-gray-300 rounded"
            placeholder="Describe your complaint"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />

          <div className="modal-action">
            <button
              type="submit"
              className="btn bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ComplaintFormModal;
