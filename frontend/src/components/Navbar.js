import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ token, setToken }) {
  const logout = () => {
    console.log("logout");
    setToken(null); // Update the token state directly via prop
  };

  return (
    <nav className='navbar'>
      <Link to="/">Dashboard</Link>
      {token && <Link to="/profile">Profile</Link>}
      {token && <Link to="/books">Books</Link>}
      {token && <Link to="/follows">Follows</Link>}
      {!token && <Link to="/login">Log in</Link>}
      {token && <Link onClick={logout}>Log out</Link>}
    </nav>
  );
}

export default Navbar;
