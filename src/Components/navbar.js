import React from 'react';
const navbar = () => {
    return (
        <header>
            <nav>
                <div>Vendorheckout</div>
                <a href='/wishlist'><button>Wishlist</button></a>
                <a href='/'><button>Vendors</button></a>
            </nav>
        </header>
    )
}
export default navbar
