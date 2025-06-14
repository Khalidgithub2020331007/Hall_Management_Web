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
        const itemRes = await axios.get("/dining_canteen_shop/items/");
        const feedbackRes = await axios.get("/dining_canteen_shop/feedbacks/");

        const items = itemRes.data.results || [];
        const feedbacks = feedbackRes.data.results || [];

        setMenuItems(items);

        // Filter feedbacks by this user's registration number
        const userFeedbacks = feedbacks.filter(
          (fb) => fb.user?.registration_number === registrationNumber
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
    if (!fb?.rating || !fb?.comment) return;

    try {
      const payload = {
        item: id,
        rating: fb.rating,
        review: fb.comment,
      };

      await axios.post("/dining_canteen_shop/feedbacks/", payload);
      alert("Feedback submitted!");

      setExistingFeedbacks((prev) => [...prev, { item: id, ...payload }]);
      setExpandedCard(null);
    } catch (err) {
      console.error("Submit error", err);
      alert("You may have already submitted feedback.");
    }
  };

  const hasGivenFeedback = (id) =>
    existingFeedbacks.some((fb) => fb.item === id);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Menu Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(menuItems) && menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-md p-4">
              <h2 className="text-lg font-bold">{item.item}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Hall: {item.hall_name}
              </p>
              <p className="text-sm mt-1">
                Meal Time: {item.meal_time || "N/A"}
              </p>
              <p className="text-sm">Price: ৳{item.price}</p>

              {!hasGivenFeedback(item.id) ? (
                <>
                  {expandedCard === item.id ? (
                    <div className="transition-all duration-500 ease-in-out overflow-hidden mt-3">
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
