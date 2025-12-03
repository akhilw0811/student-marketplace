import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await api.get('/api/messages');
                // Group messages by other user
                const grouped = {};
                data.messages.forEach(msg => {
                    const otherUserId = msg.from_user_id === user.id ? msg.to_user_id : msg.from_user_id;
                    const otherUserName = msg.from_user_id === user.id ? msg.to_user_name : msg.from_user_name;

                    if (!grouped[otherUserId]) {
                        grouped[otherUserId] = {
                            userId: otherUserId,
                            userName: otherUserName,
                            lastMessage: msg,
                        };
                    }
                    // Since API returns sorted by DESC, the first one encountered is the latest
                });
                setThreads(Object.values(grouped));
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMessages();
        }
    }, [user]);

    if (loading) return <div className="text-center py-10">Loading messages...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>

            {threads.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600 mb-4">No messages yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {threads.map((thread) => (
                        <Link
                            key={thread.userId}
                            to={`/messages/${thread.userId}`}
                            className="block p-4 border-b hover:bg-gray-50 transition last:border-b-0"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{thread.userName}</h3>
                                    <p className="text-gray-600 truncate max-w-md">{thread.lastMessage.content}</p>
                                    {thread.lastMessage.listing_title && (
                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                                            {thread.lastMessage.listing_title}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-400">
                                    {new Date(thread.lastMessage.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
