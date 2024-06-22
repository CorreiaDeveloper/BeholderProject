import React from "react";
import { Link } from "react-router-dom";

function getClassName(itemName) {
    return window.location.pathname === itemName ? 'nav-item active' : 'nav-item';
}


function SideBarItem(props) {
    return (
        <li className={getClassName(props.to)}>
            <Link to={props.to} class="nav-link" onClick={props.onClick}>
                <span class="sidebar-icon">
                    {props.children}
                </span>
                <span class="sidebar-text">{props.text}</span>
            </Link>
        </li>
    )
}

export default SideBarItem;