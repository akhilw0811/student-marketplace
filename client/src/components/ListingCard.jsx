import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
    return (
        <Link to={`/listings/${listing.id}`} className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-500">No Image</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 truncate">{listing.title}</h3>
                <p className="text-blue-600 font-bold mb-2">${Number(listing.price).toFixed(2)}</p>
                <div className="flex justify-between text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{listing.category}</span>
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
}
