import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                // Assuming the backend has an endpoint or filter for user's listings
                // If not, we might need to filter client-side or add a query param
                // For now, let's assume filtering by seller_id on client side if API returns all,
                // OR better, let's assume the backend supports filtering by seller_id if we pass it,
                // OR we use the /api/listings endpoint and filter.
                // Given the prompt didn't specify a specific "my listings" endpoint, we'll use the general one
                // and filter, or assume the backend handles it.
                // Let's try to fetch all and filter by user.id for now as a safe bet if no specific endpoint exists.
                // Wait, the prompt says "Show listings owned by the current user".
                // Let's fetch all and filter.
                const data = await api.get('/api/listings');
                const myListings = data.listings.filter(l => l.seller_id === user?.id);
                setListings(myListings);
            } catch (error) {
                console.error('Failed to fetch my listings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyListings();
        }
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/listings/${id}`);
            setListings(listings.filter(l => l.id !== id));
        } catch (error) {
            console.error('Failed to delete listing:', error);
            alert('Failed to delete listing');
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Listings</h1>

            {listings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600 mb-4">You haven't listed any items yet.</p>
                    <Link to="/sell" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        Start Selling
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center border">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    {listing.image_url ? (
                                        <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="flex items-center justify-center h-full text-xs text-gray-500">No Img</span>
                                    )}
                                </div>
                                <div>
                                    <Link to={`/listings/${listing.id}`} className="text-lg font-semibold hover:text-blue-600">
                                        {listing.title}
                                    </Link>
                                    <p className="text-gray-500 text-sm">${Number(listing.price).toFixed(2)} • {listing.category}</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    to={`/sell?id=${listing.id}`}
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(listing.id)}
                                    className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
