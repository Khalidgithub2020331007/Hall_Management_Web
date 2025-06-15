import React, { useEffect, useState } from "react";
import axios from "axios";

const currentUserRole = "office";

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/notice_board/notices/")
      .then((res) => {
        setNotices(res.data.results);
      })
      .catch((err) => console.error("Error fetching notices:", err));
  }, []);

  const handlePostNotice = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.content);
    form.append("hall_name", "Shahparan Hall");
    form.append("notice_sender_name", "Office Staff");
    form.append("notice_sender_email", 1);
    if (formData.file) form.append("file", formData.file);

    axios
      .post("http://127.0.0.1:8000/notice_board/notices/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setNotices((prev) => [res.data, ...prev]);
        setFormData({ title: "", content: "", file: null });
        setShowForm(false);
      })
      .catch((err) => console.error("Error posting notice:", err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/notice_board/notices/${id}/`)
      .then(() => {
        setNotices((prev) => prev.filter((notice) => notice.notice_id !== id));
      })
      .catch((err) => console.error("Error deleting notice:", err));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Notices</h2>
        {currentUserRole === "office" && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            New Notice
          </button>
        )}
      </div>


      {currentUserRole === "office" && showForm && (
        <form
          onSubmit={handlePostNotice}
          className="bg-white p-4 rounded shadow max-w-full flex flex-col gap-3 w-full md:w-[700px] mb-6"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              rows={5}
              className="w-full border px-3 py-2 rounded resize-y"
              placeholder="Write your notice here..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Attachment (optional)</label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Notice
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {notices
          .sort(
            (a, b) =>
              new Date(b.notice_data_and_time) -
              new Date(a.notice_data_and_time)
          )
          .map((notice) => (
            <div
              key={notice.notice_id}
              className="p-4 bg-white border rounded shadow-sm w-full break-words"
            >
              <h3 className="font-semibold text-lg mb-1">{notice.title}</h3>
              <p className="text-gray-800 whitespace-pre-wrap">
                {notice.description}
              </p>
              {notice.file && (
                <a
                  href={
                    notice.file.startsWith("http")
                      ? notice.file
                      : `http://127.0.0.1:8000${notice.file}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline block mt-2"
                >
                  📄 View Attachment
                </a>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Posted by: {notice.notice_sender_name} | {new Date(notice.notice_data_and_time).toLocaleDateString()}
              </p>
              {currentUserRole === "office" && (
                <button
                  onClick={() => handleDelete(notice.notice_id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
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

export default ManageNotices;
