import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MessageThread() {
    const { userId } = useParams();
    const [searchParams] = useSearchParams();
    const listingId = searchParams.get('listingId');
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const data = await api.get(`/api/messages/${userId}`);
            setMessages(data.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Optional: Poll for new messages every few seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const payload = {
                toUserId: userId,
                content: newMessage,
                listingId: listingId ? parseInt(listingId) : undefined
            };

            await api.post('/api/messages', payload);
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
        }
    };

    if (loading) return <div className="text-center py-10">Loading conversation...</div>;

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-semibold">Conversation</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.from_user_id === user.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {msg.listing_title && (
                                            <div className="text-xs opacity-75 mb-1 border-b border-white/20 pb-1">
                                                Re: {msg.listing_title}
                                            </div>
                                        )}
                                        <p>{msg.content}</p>
                                        <div className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
