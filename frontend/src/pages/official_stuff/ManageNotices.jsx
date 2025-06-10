import React, { useState } from "react";

const currentUserRole = "office"; // Change this to "student" or "dining" to test

const ManageNotices = () => {
  const [activeSection, setActiveSection] = useState("student");

  const [notices, setNotices] = useState({
    student: [
      {
        id: 1,
        title: "Very Long Notice",
        content:
          "This is a very long notice meant to test how the content behaves when it spans multiple lines. It should wrap correctly, stay within the container, and not overflow or break the layout at all. Let's see if it looks clean and readable.",
        postedBy: "Office Staff",
        date: new Date("2024-06-01"),
      },
    ],
    dining: [],
  });

  const [formData, setFormData] = useState({ title: "", content: "", section: "student" });

  const handlePostNotice = (e) => {
    e.preventDefault();

    const newNotice = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      postedBy: "Office Staff",
      date: new Date(),
    };

    setNotices((prev) => ({
      ...prev,
      [formData.section]: [newNotice, ...prev[formData.section]],
    }));

    setFormData({ title: "", content: "", section: "student" });
  };

  const handleDelete = (section, id) => {
    setNotices((prev) => ({
      ...prev,
      [section]: prev[section].filter((notice) => notice.id !== id),
    }));
  };

  const renderNoticeList = (section) => {
    const sorted = [...notices[section]].sort((a, b) => b.date - a.date);
    return sorted.map((notice) => (
      <div
        key={notice.id}
        className="p-4 bg-white border rounded shadow-sm w-full break-words"
      >
        <h3 className="font-semibold text-lg mb-1">{notice.title}</h3>
        <p className="text-gray-800 whitespace-pre-wrap">{notice.content}</p>
        <p className="text-sm text-gray-500 mt-2">
          Posted by: {notice.postedBy} | {notice.date.toLocaleDateString()}
        </p>
        {currentUserRole === "office" && (
          <button
            onClick={() => handleDelete(section, notice.id)}
            className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">

{currentUserRole === "office" && (
          <form
            onSubmit={handlePostNotice}
            className="bg-white p-4 rounded shadow max-w-full flex flex-col gap-3 w-full md:w-[700px]"
          >
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="border px-2 py-1 rounded"
                >
                  <option value="student">Student</option>
                  <option value="dining">Dining</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={5}
                className="w-full border px-3 py-2 rounded resize-y"
                placeholder="Write your notice here..."
              />
            </div>
            <button
              type="submit"
              className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Notice
            </button>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveSection("student")}
          className={`px-4 py-2 rounded ${
            activeSection === "student" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setActiveSection("dining")}
          className={`px-4 py-2 rounded ${
            activeSection === "dining" ? "bg-green-600 text-white" : "bg-white border"
          }`}
        >
          Dining
        </button>
      </div>

      {/* Notice List */}
      <div className="space-y-4">{renderNoticeList(activeSection)}</div>
    </div>
  );
};

export default ManageNotices;