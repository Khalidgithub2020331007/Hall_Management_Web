import React, { useEffect, useState } from 'react';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/notice_board/notices/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNotices(data.results || []);
            } catch (error) {
                console.error('Error fetching notices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Loading notices...</p>;
    }

    if (notices.length === 0) {
        return <p className="text-center mt-10 text-gray-500">There are no notices right now.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Notice Board</h2>
            <div className="space-y-6">
                {notices.map((notice) => (
                    <div
                        key={notice.notice_id}
                        className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition"
                    >
                        <h3 className="text-xl font-semibold text-blue-700">{notice.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            Posted by <span className="font-medium">{notice.notice_sender_name}</span>
                            {' '}from <span className="italic">{notice.hall_name}</span>
                            {' '}on {notice.notice_data_and_time
                                ? new Date(notice.notice_data_and_time).toLocaleString()
                                : 'Unknown date'}
                        </p>
                        <p className="text-gray-700 mb-3">{notice.description}</p>

                        {notice.file && (
                            <a
                                href={notice.file.startsWith('http') ? notice.file : `http://127.0.0.1:8000${notice.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                📄 View Attachment
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notices;
