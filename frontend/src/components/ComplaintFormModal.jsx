// ComplaintFormModal.jsx
import { useState } from "react";
import axios from "axios";

const ComplaintFormModal = ({ onClose, onSubmitSuccess }) => {
  const [tag, setTag] = useState("");
  const [details, setDetails] = useState("");
  const registrationNumber = localStorage.getItem("registrationNumber");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/complain/complain/", {
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
      <div className="modal-box">
        <h3 className="font-bold text-lg">Submit a Complaint</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="select select-bordered w-full"
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
            className="textarea textarea-bordered w-full"
            placeholder="Describe your complaint"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
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
