import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Gator Marketplace</Link>
                <div className="space-x-4">
                    <Link to="/login" className="hover:underline">Login</Link>
                    <Link to="/signup" className="hover:underline">Signup</Link>
                    <Link to="/sell" className="hover:underline">Sell</Link>
                    <Link to="/my-listings" className="hover:underline">My Listings</Link>
                    <Link to="/messages" className="hover:underline">Messages</Link>
                </div>
            </div>
        </nav>
    );
}
