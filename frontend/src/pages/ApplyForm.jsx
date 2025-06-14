import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    permanent_address: "",
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

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/halls_and_rooms/hall/")
      .then((res) => {
        // Defensive: get res.data.results if paginated else res.data
        const hallsData = Array.isArray(res.data.results) ? res.data.results : res.data;
        setHalls(hallsData);
      })
      .catch((err) => {
        console.error("Failed to fetch halls:", err);
        setHalls([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "file") {
      newValue = files.length > 0 ? files[0] : null;
    } else {
      newValue = value;
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append only non-null and non-empty values
      for (const key in formData) {
        const val = formData[key];
        if (val !== null && val !== "" && val !== undefined) {
          data.append(key, val);
        }
      }

      // Debugging: log all form data
      for (let pair of data.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await axios.post(
        "http://127.0.0.1:8000/student_admission/application/",
        data
        // Do NOT set Content-Type header manually with FormData,
        // Axios sets it automatically.
      );

      if (res.status === 201 || res.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/"); // Redirect after success
        }, 2000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      alert("Server error. Please check console for details.");
    }
  };


  return (
    <div className="bg-accent-500 min-h-screen py-10">
      <div className="p-6 max-w-4xl mx-auto bg-sky-300 shadow-xl rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-black">Hall Seat Application Form</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <input
            name="registration_number"
            type="text"
            placeholder="Registration Number"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.registration_number}
            onChange={handleChange}
            required
          />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone_number"
            type="text"
            placeholder="Phone Number"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <select
            name="blood_group"
            className="select select-bordered w-full text-black bg-white shadow-md"
            onChange={handleChange}
            required
          >
            <option value="">Blood Group</option>
            <option value="A+">A positive (A+)</option>
            <option value="A-">A negative (A-)</option>
            <option value="B+">B positive (B+)</option>
            <option value="B-">B negative (B-)</option>
            <option value="AB+">AB positive (AB+)</option>
            <option value="AB-">AB negative (AB-)</option>
            <option value="O+">O positive (O+)</option>
            <option value="O-">O negative (O-)</option>
            <option value="Others">Others</option>
          </select>
          <input
            name="father_name"
            type="text"
            placeholder="Father's Name"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.father_name}
            onChange={handleChange}
            required
          />
          <input
            name="mother_name"
            type="text"
            placeholder="Mother's Name"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.mother_name}
            onChange={handleChange}
            required
          />

          {/* Select fields */}
          <select
            name="gender"
            className={"select select-bordered w-full " + specialclass1}
            value={formData.gender}
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
            className={"input input-bordered w-full " + specialclass1}
            value={formData.department_name}
            onChange={handleChange}
            required
          />

          <select
            name="study_program"
            className={"select select-bordered w-full " + specialclass1}
            value={formData.study_program}
            onChange={handleChange}
            required
          >
            <option value="">Study Program</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>


          <select
            name="session"
            className={"select select-bordered w-full " + specialclass1}
            value={formData.session}
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
            className={"select select-bordered w-full " + specialclass1}
            value={formData.semester}
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
            name="permanent_address"
            placeholder="Permanent Address"
            className={"textarea textarea-bordered w-full " + specialclass1 + " md:col-span-2"}
            value={formData.permanent_address}
            onChange={handleChange}
            required
          />
          <input
            name="home_distance_from_SUST_in_km"
            type="number"
            step="0.1"
            placeholder="Distance from SUST (km)"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.home_distance_from_SUST_in_km}
            onChange={handleChange}
            required
          />
          <input
            name="family_monthly_income"
            type="number"
            placeholder="Family Monthly Income"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.family_monthly_income}
            onChange={handleChange}
            required
          />
          <textarea
            name="special_reason_for_hall_seat"
            placeholder="Special Reason (if any)"
            className={"textarea textarea-bordered w-full " + specialclass1 + " md:col-span-2"}
            value={formData.special_reason_for_hall_seat}
            onChange={handleChange}
          />

          {/* Academic Info */}
          <input
            name="total_credits_offered"
            type="number"
            step="0.1"
            placeholder="Total Credits Offered"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.total_credits_offered}
            onChange={handleChange}
            required
          />
          <input
            name="total_credits_completed"
            type="number"
            step="0.1"
            placeholder="Total Credits Completed"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.total_credits_completed}
            onChange={handleChange}
            required
          />
          <input
            name="cgpa"
            type="number"
            step="0.01"
            placeholder="CGPA"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.cgpa}
            onChange={handleChange}
            required
          />
          <input
            name="last_semester_gpa"
            type="number"
            step="0.01"
            placeholder="Last Semester GPA"
            className={"input input-bordered w-full " + specialclass1}
            value={formData.last_semester_gpa}
            onChange={handleChange}
            required
          />


          {/* Hall Selection */}
          <select
            name="attached_hall"
            className={"select select-bordered w-full " + specialclass1}
            value={formData.attached_hall}
            onChange={handleChange}
            required
          >
            <option value="">Attached Hall</option>
            {Array.isArray(halls) &&
              halls.map((hall) => (
                <option key={hall.hall_id} value={hall.hall_id}>
                  {hall.hall_name}
                </option>
              ))}
          </select>

          {/* Checkbox inputs */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_resident"
              checked={formData.is_resident}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span>Currently Resident in University Hall</span>
          </label>

          {formData.is_resident && (
            <input
              name="resident_months_in_university_hall"
              type="number"
              placeholder="Months as Resident"
              className={"input input-bordered w-full " + specialclass1}
              value={formData.resident_months_in_university_hall}
              onChange={handleChange}
              min={0}
            />
          )}

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="convicted"
              checked={formData.convicted}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
            <span>Have you been convicted?</span>
          </label>

          <label className="block w-full">
            Profile Picture:
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </label>

          <button type="submit" className="btn btn-primary w-full md:col-span-2">
            Submit Application
          </button>
        </form>

        {showSuccess && (
          <div className="alert alert-success mt-4">
            Application submitted successfully! Redirecting...
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyForm;
