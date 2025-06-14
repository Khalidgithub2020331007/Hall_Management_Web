import { useState, useEffect } from "react";
import axios from "axios";

const LostFoundItems = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "lost",
    itemName: "",
    image: null,
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Dummy user fetch for demonstration, replace with your auth logic
  useEffect(() => {
    // Example currentUser with registration_number for demo
    setCurrentUser({
      name: "John Doe",
      phone: "01700000000",
      room: "302",
      registration_number: "20231234",
    });
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://127.0.0.1:8000/lost_and_found/new_lost_and_found/"
        );

        // Map API data correctly
        const fetchedItems = res.data.results.map((item) => ({
          id: item.post_id,
          type: item.status,
          itemName: item.element_name,
          image: item.image,
          details:
            item.element_description +
            (item.found_location ? " at " + item.found_location : ""),
          date: item.post_date_time.split("T")[0],
          postedBy: {
            name: item.user_email?.name || "Unknown",
            phone: item.contact_number || item.user_email?.phone_number || "N/A",
            room: item.user_email?.room || "N/A",
            registration_number: item.user_email?.registration_number || "N/A",
          },
        }));

        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load lost and found items.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split("T")[0],
      postedBy: {
        name: currentUser?.name || "Unknown",
        phone: currentUser?.phone || "N/A",
        room: currentUser?.room || "N/A",
        registration_number: currentUser?.registration_number || "N/A",
      },
    };

    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      type: "lost",
      itemName: "",
      image: null,
      details: "",
    });
  };

  const handleDelete = async (id) => {
    setDeleteError(null);
    try {
      await axios.delete(
        `http://127.0.0.1:8000/lost_and_found/new_lost_and_found/${id}/`
      );
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setDeleteError("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lost & Found</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Anything Lost/Found?
        </button>
      </div>

      {showForm && (
  <form className="card p-4 border mb-4 space-y-3" onSubmit={handleSubmit}>
    <div className="flex gap-4">
      <label className="label cursor-pointer">
        <input
          type="radio"
          name="type"
          value="lost"
          className="radio"
          checked={formData.type === "lost"}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        <span className="label-text ml-2">Lost</span>
      </label>
      <label className="label cursor-pointer">
        <input
          type="radio"
          name="type"
          value="found"
          className="radio"
          checked={formData.type === "found"}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        <span className="label-text ml-2">Found</span>
      </label>
    </div>

    <input
      type="text"
      placeholder="Item name"
      className="input input-bordered w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      value={formData.itemName}
      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
      required
    />
    <textarea
      className="textarea textarea-bordered w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      placeholder="Details"
      value={formData.details}
      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
      required
    ></textarea>

    <input
      type="file"
      className="file-input file-input-bordered w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
    />

    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => setShowForm(false)}
      >
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        Post
      </button>
    </div>
  </form>
)}


      {loading && <p>Loading lost and found items...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {deleteError && <p className="text-red-500">{deleteError}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card border p-4 space-y-2">
            <div className="badge badge-info capitalize w-fit">{item.type}</div>
            <h3 className="font-bold">{item.itemName}</h3>
            {item.image && (
              <img
                src={
                  typeof item.image === "string"
                    ? item.image
                    : URL.createObjectURL(item.image)
                }
                alt="Item"
                className="rounded max-h-40 object-cover"
              />
            )}
            <p>{item.details}</p>
            <p className="text-sm text-gray-500">Date: {item.date}</p>
            <div className="text-sm text-gray-600">
              <p>By: {item.postedBy.name}</p>
              <p>Phone: {item.postedBy.phone}</p>
              <p>Room: {item.postedBy.room}</p>
            </div>
            {/* DELETE BUTTON ALWAYS VISIBLE */}
            <button
              onClick={() => handleDelete(item.id)}
              className="btn btn-sm btn-error"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostFoundItems;
