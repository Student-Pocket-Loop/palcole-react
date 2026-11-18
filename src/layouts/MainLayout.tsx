import { Link, NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
    { path: "/users", label: "Users" },
    { path: "/roles", label: "Roles" },
    { path: "/categories", label: "Categories" },
    { path: "/academic-items", label: "Academic Items" },
    { path: "/promotions", label: "Promotions" },
    { path: "/favorite-items", label: "Favorite Items" },
    { path: "/favorite-promotions", label: "Favorite Promotions" },
    { path: "/conversations", label: "Conversations" },
    { path: "/messages", label: "Messages" },
];

export default function MainLayout() {
    return (
        <div className="layout-wrapper">
            <header className="navbar">
                <nav className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        Palcole
                    </Link>

                    <ul className="navbar-links">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? "navbar-link active" : "navbar-link"
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <main className="main-container">
                <Outlet />
            </main>

            <footer className="footer">
                © {new Date().getFullYear()} Palcole CRUD. Todos los derechos reservados.
            </footer>
        </div>
    );
}
