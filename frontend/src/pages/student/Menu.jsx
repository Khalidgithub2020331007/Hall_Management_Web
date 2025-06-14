import { useEffect, useState } from "react";
import axios from "axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [existingFeedbacks, setExistingFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  const registrationNumber = localStorage.getItem("registrationNumber") || "20230001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemRes = await axios.get("http://127.0.0.1:8000/dining_canteen_shop/items/");
        const feedbackRes = await axios.get("http://127.0.0.1:8000/dining_canteen_shop/feedbacks/");

        const items = itemRes.data.results || [];
        const feedbacks = feedbackRes.data.results || [];

        setMenuItems(items);

        // Filter feedbacks by this user's registration number
        const userFeedbacks = feedbacks.filter(
          (fb) => fb.user_name === registrationNumber // assuming registrationNumber matches user_name, adjust if needed
        );
        setExistingFeedbacks(userFeedbacks);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    fetchData();
  }, [registrationNumber]);

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
    if (!fb?.rating || !fb?.comment) {
      alert("Please provide both rating and feedback.");
      return;
    }

    try {
      const payload = {
        item: id,
        rating: fb.rating,
        review: fb.comment,
      };

      await axios.post("http://127.0.0.1:8000/dining_canteen_shop/feedbacks/", payload);
      alert("Feedback submitted!");

      setExistingFeedbacks((prev) => [...prev, { item: id, ...payload }]);
      setExpandedCard(null);
      setFeedback((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.error("Submit error", err);
      alert("You may have already submitted feedback or there was an error.");
    }
  };

  const hasGivenFeedback = (id) =>
    existingFeedbacks.some((fb) => fb.item === id);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Menu Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(menuItems) && menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item.id} className="card bg-white shadow-md p-5 rounded-md">
              <h2 className="text-xl font-semibold text-gray-900">{item.item}</h2>
              <p className="text-sm text-gray-600 mt-1">Owner: {item.owner_name}</p>
              <p className="text-sm mt-1">Meal Time: {item.meal_time || "N/A"}</p>
              <p className="text-sm font-medium">Price: ৳{item.price}</p>

              {!hasGivenFeedback(item.id) ? (
                <>
                  {expandedCard === item.id ? (
                    <div className="mt-4 space-y-3">
                      <select
                        className="select select-bordered w-full bg-white text-gray-900"
                        value={feedback[item.id]?.rating || ""}
                        onChange={(e) =>
                          handleFeedbackChange(item.id, "rating", e.target.value)
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
                        className="textarea textarea-bordered w-full bg-white text-gray-900"
                        placeholder="Write your feedback..."
                        value={feedback[item.id]?.comment || ""}
                        onChange={(e) =>
                          handleFeedbackChange(item.id, "comment", e.target.value)
                        }
                      ></textarea>

                      <div className="flex gap-3">
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
                  ) : (
                    <button
                      className="btn btn-outline btn-sm mt-4"
                      onClick={() => setExpandedCard(item.id)}
                    >
                      Give Feedback
                    </button>
                  )}
                </>
              ) : (
                <p className="text-green-600 text-sm mt-4">
                  You’ve already submitted feedback.
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No menu items available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
