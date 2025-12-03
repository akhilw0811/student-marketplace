import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Sell() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Textbooks');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (editId) {
            const fetchListing = async () => {
                try {
                    const data = await api.get(`/api/listings/${editId}`);
                    const { title, description, price, category, image_url } = data.listing;
                    setTitle(title);
                    setDescription(description);
                    setPrice(price);
                    setCategory(category);
                    setImageUrl(image_url || '');
                } catch (err) {
                    console.error('Failed to fetch listing for edit:', err);
                    setError('Failed to load listing details.');
                }
            };
            fetchListing();
        }
    }, [user, navigate, editId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const listingData = {
            title,
            description,
            price: parseFloat(price),
            category,
            image_url: imageUrl,
        };

        try {
            if (editId) {
                await api.put(`/api/listings/${editId}`, listingData);
            } else {
                await api.post('/api/listings', listingData);
            }
            navigate('/my-listings');
        } catch (err) {
            setError(err.message || 'Failed to save listing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
                {editId ? 'Edit Listing' : 'List an Item'}
            </h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Textbooks">Textbooks</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Image URL (Optional)</label>
                    <input
                        type="url"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
                >
                    {loading ? 'Saving...' : (editId ? 'Update Listing' : 'Post Listing')}
                </button>
            </form>
        </div>
    );
}
