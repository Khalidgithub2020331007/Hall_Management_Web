import { useState, useEffect } from "react";
// import axios from "axios";

// Dummy fetchCurrentUser function (replace with real API call)
const fetchCurrentUser = async () => {
  // const res = await axios.get("/api/user/me");
  // return res.data;
  return {
    name: "John Doe",
    phone: "01700000000",
    room: "302",
    registration_number: "20231234",
  };
};

const LostFoundItems = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([
    {
      id: 1,
      type: "lost",
      itemName: "Wallet",
      image: null,
      details: "Brown leather wallet lost in the library.",
      date: "2025-06-07",
      postedBy: {
        name: "John Doe",
        phone: "01700000000",
        room: "302",
        registration_number: "20231234",
      },
    },
    {
      id: 2,
      type: "found",
      itemName: "Water Bottle",
      image: null,
      details: "Found near the common room. Blue color.",
      date: "2025-06-07",
      postedBy: {
        name: "Jane Smith",
        phone: "01800000000",
        room: "405",
        registration_number: "20234567",
      },
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "lost",
    itemName: "",
    image: null,
    details: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
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

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
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
        <form
          className="card p-4 border mb-4 space-y-3"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="type"
                value="lost"
                className="radio"
                checked={formData.type === "lost"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
              <span className="label-text ml-2">Found</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Item name"
            className="input input-bordered w-full"
            value={formData.itemName}
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
            required
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Details"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            required
          ></textarea>

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card border p-4 space-y-2">
            <div className="badge badge-info capitalize w-fit">{item.type}</div>
            <h3 className="font-bold">{item.itemName}</h3>
            {item.image && (
              <img
                src={URL.createObjectURL(item.image)}
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
            {currentUser &&
              item.postedBy.registration_number ===
                currentUser.registration_number && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostFoundItems;
