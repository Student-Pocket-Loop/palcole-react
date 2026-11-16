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
        <>
            <header>
                <nav>
                    <Link to="/">
                        <strong>Palcole</strong>
                    </Link>

                    <ul>
                        {NAV_ITEMS.map((item) => (
                        <li key={item.path}>
                            <NavLink
                            to={item.path}
                            style={({ isActive }) => ({
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                            >
                            {item.label}
                            </NavLink>
                        </li>
                        ))}
                    </ul>
                </nav>
            </header>
            
            <main>
                <Outlet />
            </main>

            <footer>
                <p>© {new Date().getFullYear()} Palcole CRUD. Todos los derechos reservados.</p>
            </footer>
        </>
    );
}
