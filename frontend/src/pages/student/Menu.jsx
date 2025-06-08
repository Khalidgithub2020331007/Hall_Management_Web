import { useEffect, useState } from "react";
import axios from "axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [existingFeedbacks, setExistingFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const registrationNumber =
    localStorage.getItem("registrationNumber") || "20230001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const menuRes = await axios.get(`/api/menu/today`);
        // const feedbackRes = await axios.get(`/api/feedback?registration_number=${registrationNumber}`);
        // setMenuItems(menuRes.data);
        // setExistingFeedbacks(feedbackRes.data);

        // Hardcoded data for UI
        setMenuItems([
          {
            id: 1,
            name: "Chicken Curry",
            description: "Spicy chicken curry",
            price: 120,
          },
          { id: 2, name: "Veg Khichuri", description: "With egg", price: 90 },
        ]);
        setExistingFeedbacks([
          { menu_item_id: 1, rating: 4, comment: "Tasty!" },
        ]);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  const handleFeedbackChange = (id, field, value) => {
    setFeedback((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmitFeedback = async (id) => {
    const fb = feedback[id];
    if (!fb?.rating || !fb?.comment) return;

    try {
      const payload = {
        menu_item_id: id,
        registration_number: registrationNumber,
        rating: fb.rating,
        comment: fb.comment,
      };

      // await axios.post("/api/feedback", payload);
      alert("Feedback submitted!");
      setExistingFeedbacks((prev) => [
        ...prev,
        { menu_item_id: id, ...payload },
      ]);
      setExpandedCard(null);
    } catch (err) {
      console.error("Submit error", err);
      alert("You may have already submitted feedback.");
    }
  };

  const hasGivenFeedback = (id) =>
    existingFeedbacks.some((fb) => fb.menu_item_id === id);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Today's Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-md p-4">
            <h2 className="text-lg font-bold">{item.food}</h2>
            {item.image && (
              <img
                src={item.image}
                alt={item.food}
                className="w-full h-40 object-cover rounded mt-2"
              />
            )}
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            <p className="text-sm mt-1">Price: ৳{item.price}</p>
            <p className="text-sm">Available: {item.availability_time}</p>

            {!hasGivenFeedback(item.id) ? (
              <>
                {expandedCard === item.id ? (
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedCard === item.id
                        ? "max-h-[500px] opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-2">
                      <select
                        className="select select-bordered w-full"
                        value={feedback[item.id]?.rating || ""}
                        onChange={(e) =>
                          handleFeedbackChange(
                            item.id,
                            "rating",
                            e.target.value
                          )
                        }
                      >
                        <option disabled value="">
                          Select Rating
                        </option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>

                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Write your feedback..."
                        value={feedback[item.id]?.comment || ""}
                        onChange={(e) =>
                          handleFeedbackChange(
                            item.id,
                            "comment",
                            e.target.value
                          )
                        }
                      ></textarea>

                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSubmitFeedback(item.id)}
                        >
                          Submit
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setExpandedCard(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline btn-sm mt-2"
                    onClick={() => setExpandedCard(item.id)}
                  >
                    Give Feedback
                  </button>
                )}
              </>
            ) : (
              <p className="text-green-600 text-sm mt-2">
                You’ve already submitted feedback.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
