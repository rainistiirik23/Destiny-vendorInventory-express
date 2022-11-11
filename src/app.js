import React from 'react';
import { createRoot } from "react-dom/client";
import Vendorpage from "./Pages/vendorpage"
import Wishlistpage from "./Pages/wishlist.js"
const App = () => {
    const url = window.location.href
    console.log(url.slice(22))
    const Route = url.slice(22)
    if (Route === 'wishlist') {
        return (<Wishlistpage></Wishlistpage>)
    }
    return (

        <Vendorpage></Vendorpage>
    )
};


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App></App>)
