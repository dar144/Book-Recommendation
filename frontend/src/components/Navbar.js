import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ token }) {
    const logout = () => {
        console.log("logout");
        localStorage.removeItem("token"); 
        window.location.reload();
      };

    return (
        <nav className='navbar'>
            <Link to="/">Dashboard</Link>
            {token && <Link to="/profile">Profile</Link>}
            {token && <Link to="/books">Books</Link>}
            {!token && <Link to="/login">Log in</Link>}
            {token && <Link onClick={logout} to="/logout">Log out</Link>}
        </nav>
    );
}

export default Navbar;
