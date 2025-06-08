// src/components/MenuCard.jsx
import React from "react";

const MenuCard = ({
  item,
  today,
  onToggleAvailability,
  onDelete,
  onAddToToday,
}) => {
  const isToday = item.date === today;

  return (
    <div className="card shadow-md p-4 w-full max-w-md bg-accent">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{item.name}</h3>
        <span className="text-sm text-gray-500">{item.price}৳</span>
      </div>
      <p className="text-sm my-2 line-clamp-3 overflow-auto max-h-24">
        {item.description}
      </p>
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-cover mb-2 rounded"
        />
      )}
      {isToday ? (
        <div className="flex gap-2 flex-wrap">
          <span
            className={`badge ${
              item.is_available ? "badge-success" : "badge-error"
            }`}
          >
            {item.is_available ? "Available" : "Unavailable"}
          </span>
          <button
            onClick={() => onToggleAvailability(item.id, !item.is_available)}
            className={`btn btn-xs ${
              item.is_available ? "btn-warning" : "btn-success"
            }`}
          >
            {item.is_available ? "Mark Unavailable" : "Mark Available"}
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this item?"))
                onDelete(item.id);
            }}
            className="btn btn-xs btn-error"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="btn btn-xs btn-info mt-2"
            onClick={() => onAddToToday(item)}
          >
            Add to Today
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this item?"))
                onDelete(item.id);
            }}
            className="btn btn-xs btn-error mt-2"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuCard;
