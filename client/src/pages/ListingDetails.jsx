import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ListingDetails() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await api.get(`/api/listings/${id}`);
                setListing(data.listing);
            } catch (err) {
                setError('Failed to load listing details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
    if (!listing) return <div className="text-center py-10">Listing not found.</div>;

    const isOwner = user && user.id === listing.seller_id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gray-200 min-h-[300px] flex items-center justify-center">
                    {listing.image_url ? (
                        <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500 text-xl">No Image</span>
                    )}
                </div>
                <div className="md:w-1/2 p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                {listing.category}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">${Number(listing.price).toFixed(2)}</p>
                    </div>

                    <p className="text-gray-700 mb-6 whitespace-pre-line">{listing.description}</p>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-1">Seller: <span className="font-medium text-gray-900">{listing.seller_name}</span></p>
                        <p className="text-sm text-gray-500 mb-4">Posted on: {new Date(listing.created_at).toLocaleDateString()}</p>

                        {user ? (
                            !isOwner ? (
                                <Link
                                    to={`/messages/${listing.seller_id}?listingId=${listing.id}`}
                                    className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Message Seller
                                </Link>
                            ) : (
                                <div className="text-center text-gray-500 italic">
                                    You are the seller of this item.
                                </div>
                            )
                        ) : (
                            <Link to="/login" className="block w-full bg-gray-100 text-center text-blue-600 py-2 rounded hover:bg-gray-200 transition">
                                Login to contact seller
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
