import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Gator Marketplace</Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <span className="mr-4">Welcome, {user.name}</span>
                            <Link to="/my-listings" className="hover:underline">My Listings</Link>
                            <Link to="/messages" className="hover:underline">Messages</Link>
                            <Link to="/sell" className="hover:underline">Sell</Link>
                            <button onClick={logout} className="hover:underline bg-red-500 px-3 py-1 rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/signup" className="hover:underline">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
