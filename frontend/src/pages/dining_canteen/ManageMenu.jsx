import { useEffect, useState } from "react";
import { format } from "date-fns";
import MenuCard from "../../components/MenuCard";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new menu item
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    availability_time: "",
  });

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    // Fetch menu items from backend
    // axios.get("/api/menu?days=8").then(res => setMenuItems(res.data));
    setMenuItems([
      {
        id: 1,
        name: "Rice & Chicken Curry",
        description:
          "Traditional lunch with plain rice and spicy chicken curry. Served hot.",
        image: null,
        price: 80,
        date: today,
        is_available: true,
      },
      {
        id: 2,
        name: "Paratha & Egg",
        description: "Two parathas with omelette. Good for breakfast.",
        image: null,
        price: 30,
        date: "2025-06-05",
        is_available: false,
      },
    ]);
  }, []);

  const toggleAvailability = async (id, availability) => {
    try {
      // await axios.patch(`/api/menu/${id}/availability`, { is_available: availability });
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_available: availability } : item
        )
      );
    } catch (err) {
      console.error("Failed to update availability", err);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      // await axios.delete(`/api/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete menu item", err);
    }
  };

  const addToToday = (item) => {
    const newItem = {
      ...item,
      id: Date.now(), // temporary id
      date: today,
      is_available: true,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    }
  };

  // Add new menu item submit handler
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();

    if (!newItem.name || !newItem.description || !newItem.price) {
      alert("Please fill in required fields: name, description, and price.");
      return;
    }

    const itemToAdd = {
      ...newItem,
      date: today,
      is_available: true,
      price: Number(newItem.price),
    };

    try {
      // const formData = new FormData();
      // formData.append("name", itemToAdd.name);
      // formData.append("description", itemToAdd.description);
      // if (newItem.image) formData.append("image", newItem.image);
      // formData.append("price", itemToAdd.price);
      // formData.append("availability_time", itemToAdd.availability_time);
      // formData.append("date", today);

      // await axios.post("/api/menu", formData);

      // For now just add locally:
      setMenuItems((prev) => [...prev, { ...itemToAdd, id: Date.now() }]);

      setShowAddModal(false);
      setNewItem({
        name: "",
        description: "",
        image: null,
        price: "",
        availability_time: "",
      });
    } catch (err) {
      console.error("Failed to add menu item", err);
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Menu</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add item for Today
        </button>
      </div>

      {Object.keys(groupedItems).map((date) => (
        <div key={date}>
          <h3 className="text-lg font-bold mb-2">
            {date === today ? "Today" : date}
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
            {groupedItems[date].map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                today={today}
                onToggleAvailability={toggleAvailability}
                onDelete={deleteMenuItem}
                onAddToToday={addToToday}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleAddItemSubmit}
            className="bg-white p-6 rounded-md w-96 shadow-lg text-black"
          >
            <h3 className="text-xl font-bold mb-4">Add Menu Item for Today</h3>

            <label className="block mb-2">
              Name <span className="text-red-500">*</span>
              <input
                type="text"
                className="input input-bordered w-full mt-1 bg-white border-black"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                required
              />
            </label>

            <label className="block mb-2">
              Description <span className="text-red-500">*</span>
              <textarea
                className="textarea textarea-bordered w-full mt-1 bg-white border-black"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                required
              />
            </label>

            <label className="block mb-2">
              Image (optional)
              <input
                type="file"
                accept="image/*"
                className="input input-bordered w-full mt-1 bg-white border-black"
                onChange={handleImageChange}
              />
            </label>

            <label className="block mb-2">
              Price (in BDT) <span className="text-red-500">*</span>
              <input
                type="number"
                min="0"
                className="input input-bordered w-full mt-1 bg-white border-black"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                required
              />
            </label>

            <label className="block mb-4">
              Availability Time
              <input
                type="text"
                placeholder="E.g. 10:00 AM - 3:00 PM"
                className="input input-bordered w-full mt-1 bg-white border-black"
                value={newItem.availability_time}
                onChange={(e) =>
                  setNewItem({ ...newItem, availability_time: e.target.value })
                }
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
