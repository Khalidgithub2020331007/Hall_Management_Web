import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const ApplyForm = () => {
  const specialclass1 = "text-black bg-white shadow-md";
  const [formData, setFormData] = useState({
    registration_number: "",
    name: "",
    phone_number: "",
    email: "",
    blood_group: "",
    father_name: "",
    mother_name: "",
    gender: "",
    department_name: "",
    study_program: "",
    session: "",
    semester: "",
    premanent_address: "",
    home_distance_from_SUST_in_km: "",
    family_monthly_income: "",
    special_reason_for_hall_seat: "",
    total_credits_offered: "",
    total_credits_completed: "",
    cgpa: "",
    last_semester_gpa: "",
    attached_hall: "",
    is_resident: false,
    resident_months_in_university_hall: "",
    convicted: false,
    profile_picture: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [halls, setHalls] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/halls/") // replace with your actual endpoint
      .then((res) => setHalls(res.data))
      .catch((err) => console.error("Failed to fetch halls:", err));
  }, []);

  const navigate = useNavigate;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      console.log("Submitted data:");
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const res = await axios.post(
        "http://127.0.0.1:8000/registration/application/",
        data
      );

      if (res.status === 201 || res.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/"); // Redirect to login
        }, 2000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      console.log("Error response:", err.response.data);
      alert("Server error.");
    }
  };

  return (
    <div className="bg-accent-500">
      <div className="p-6 max-w-4xl mx-auto bg-sky-300 shadow-xl rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Hall Seat Application Form
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Basic Info */}
          <input
            name="registration_number"
            type="text"
            placeholder="Registration Number"
            className={"input input-bordered w-full " + specialclass1}
            onChange={handleChange}
            required
          />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="phone_number"
            type="text"
            placeholder="Phone Number"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="blood_group"
            type="text"
            placeholder="Blood Group"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="father_name"
            type="text"
            placeholder="Father's Name"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="mother_name"
            type="text"
            placeholder="Mother's Name"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />

          {/* Select fields */}
          <select
            name="gender"
            className="select select-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            name="department_name"
            type="text"
            placeholder="Department Name"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />

          <select
            name="study_program"
            className="select select-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          >
            <option value="">Study Program</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>

          <select
            name="session"
            className="select select-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          >
            <option value="">Session</option>
            <option value="2019">2019-2020</option>
            <option value="2020">2020-2021</option>
            <option value="2021">2021-2022</option>
            <option value="2023">2023-2024</option>
            <option value="2024">2024-2025</option>
          </select>

          <select
            name="semester"
            className="select select-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          >
            <option value="">Semester</option>
            <option value="1/1">1/1</option>
            <option value="1/2">1/2</option>
            <option value="2/1">2/1</option>
            <option value="2/2">2/2</option>
            <option value="3/1">3/1</option>
            <option value="3/2">3/2</option>
            <option value="4/1">4/1</option>
            <option value="4/2">4/2</option>
            <option value="m/1">M/1</option>
            <option value="m/2">M/2</option>
            <option value="m/3">M/3</option>
          </select>

          {/* Additional Info */}
          <textarea
            name="premanent_address"
            placeholder="Permanent Address"
            className="textarea textarea-bordered w-full text-black bg-white shadow-md md:col-span-2"
            onChange={handleChange}
            required
          />
          <input
            name="home_distance_from_SUST_in_km"
            type="number"
            step="0.1"
            placeholder="Distance from SUST (km)"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="family_monthly_income"
            type="number"
            placeholder="Family Monthly Income"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <textarea
            name="special_reason_for_hall_seat"
            placeholder="Special Reason (if any)"
            className="textarea textarea-bordered w-full text-black bg-white shadow-md md:col-span-2"
            onChange={handleChange}
          />

          {/* Academic Info */}
          <input
            name="total_credits_offered"
            type="number"
            step="0.1"
            placeholder="Total Credits Offered"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="total_credits_completed"
            type="number"
            step="0.1"
            placeholder="Total Credits Completed"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="cgpa"
            type="number"
            step="0.01"
            placeholder="CGPA"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />
          <input
            name="last_semester_gpa"
            type="number"
            step="0.01"
            placeholder="Last Semester GPA"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          />

          {/* Hall and Residency */}
          <select
            name="attached_hall"
            value={formData.attached_hall}
            onChange={handleChange}
            className="select select-bordered w-full text-black bg-white shadow-md"
          >
            <option value="">Select Hall (optional)</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>

          <label className="label cursor-pointer">
            <span className="label-text text-black">Currently Resident?</span>
            <input
              name="is_resident"
              type="checkbox"
              className="checkbox ml-2 text-black bg-white shadow-md"
              onChange={handleChange}
            />
          </label>
          <input
            name="resident_months_in_university_hall"
            type="number"
            placeholder="Resident Months"
            className="input input-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
          />

          {/* Others */}
          <label className="label cursor-pointer">
            <span className="label-text text-black ">
              Penalized by University?
            </span>
            <input
              name="convicted"
              type="checkbox"
              className="checkbox ml-2 text-black bg-white shadow-md"
              onChange={handleChange}
            />
          </label>

          <label className="label cursor-pointer">
            <span className="label-text text-black">Choose your image:</span>
            <input
              name="profile_picture"
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full text-black bg-white shadow-md"
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full md:col-span-2 mt-4"
          >
            Submit Application
          </button>
        </form>

        {/* Success Modal */}
        {showSuccess && (
          <dialog open className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Application Submitted!</h3>
              <p className="py-4">
                Your hall seat application has been submitted successfully.
                Redirecting to login...
              </p>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default ApplyForm;
