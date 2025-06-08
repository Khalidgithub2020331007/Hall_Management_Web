import { useEffect, useState } from "react";
import { format, isSameDay, subDays, isAfter, isWithinInterval } from "date-fns";

// Simulate role (replace with auth logic)
const userRole = "official"; // "dining" or "official"

const Reviews = () => {
  const [groupedFeedbacks, setGroupedFeedbacks] = useState({});
  const [visibleDates, setVisibleDates] = useState([]);
  const [allDates, setAllDates] = useState([]);

  const today = new Date();

  // Simulated feedback data
  const rawFeedbacks = [
    {
      id: 1,
      food: "Chicken Curry",
      rating: 4,
      comment: "Tasty!",
      date: today,
      student: { name: "Rahim", reg: "201934812", department: "CSE", room: "202" },
    },
    {
      id: 2,
      food: "Khichuri",
      rating: 2,
      comment: "Too salty.",
      date: subDays(today, 1),
      student: { name: "Karim", reg: "201934850", department: "EEE", room: "105" },
    },
    {
      id: 3,
      food: "Vegetable Curry",
      rating: 5,
      comment: "Perfect.",
      date: subDays(today, 2),
      student: { name: "Nayeem", reg: "201934860", department: "BBA", room: "303" },
    },
    {
      id: 4,
      food: "Beef Bhuna",
      rating: 3,
      comment: "Could be spicier.",
      date: subDays(today, 6),
      student: { name: "Sumon", reg: "201934999", department: "LAW", room: "102" },
    },
  ];

  // Group feedbacks by date
  const groupByDate = (data) => {
    const grouped = {};
    data.forEach((fb) => {
      const key = format(fb.date, "yyyy-MM-dd");
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(fb);
    });
    return grouped;
  };

  useEffect(() => {
    let filtered = [];

    if (userRole === "dining") {
      filtered = rawFeedbacks.filter(fb =>
        isSameDay(fb.date, today) || isSameDay(fb.date, subDays(today, 1))
      );
    } else {
      filtered = rawFeedbacks.filter(fb =>
        isWithinInterval(fb.date, { start: subDays(today, 7), end: today })
      );
    }

    const grouped = groupByDate(filtered);
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    setGroupedFeedbacks(grouped);
    setAllDates(sortedDates);
    setVisibleDates(sortedDates.slice(0, 2)); // Initial pagination
  }, []);

  const handleLoadMore = () => {
    const currentLength = visibleDates.length;
    const nextDates = allDates.slice(0, currentLength + 2);
    setVisibleDates(nextDates);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Feedbacks</h2>

      {visibleDates.length === 0 ? (
        <p>No feedbacks available.</p>
      ) : (
        visibleDates.map((date) => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              {isSameDay(new Date(date), today) ? "Today" : format(new Date(date), "dd MMM yyyy")}
            </h3>
            <div className="grid gap-3">
              {groupedFeedbacks[date].map((fb) => (
                <div key={fb.id} className="card bg-base-100 p-4 shadow-md">
                  <h4 className="font-bold">{fb.food}</h4>
                  <p className="text-sm text-gray-500">Rating: {fb.rating}/5</p>
                  <p className="text-gray-700 my-1">{fb.comment}</p>
                  {/* <div className="text-sm text-gray-600">
                    <p><strong>Student:</strong> {fb.student.name}</p>
                    <p><strong>Reg:</strong> {fb.student.reg} | <strong>Dept:</strong> {fb.student.department}</p>
                    <p><strong>Room:</strong> {fb.student.room}</p>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {visibleDates.length < allDates.length && (
        <div className="text-center mt-4">
          <button className="btn btn-outline" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
