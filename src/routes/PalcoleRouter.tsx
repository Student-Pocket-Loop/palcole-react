import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";
import AllUsersPage from "../pages/AllUsersPage";
import InsertUserPage from "../pages/InsertUserPage";
import UserDetailPage from "../pages/UserDetailPage";
import UpdateUserPage from "../pages/UpdateUserPage";

export const PalcoleRouter = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <MainPage />
            },
            { path: "users", element: <AllUsersPage /> },
            { path: "users/new", element: <InsertUserPage /> },
            { path: "users/:id", element: <UserDetailPage /> },
            { path: "users/edit/:id", element: <UpdateUserPage /> },
            { path: "roles", element: <div>CRUD Roles (En construcción)</div> },
            { path: "categories", element: <div>CRUD Categories (En construcción)</div> },
            { path: "academic-items", element: <div>CRUD Academic Items (En construcción)</div> },
            { path: "promotions", element: <div>CRUD Promotions (En construcción)</div> },
            { path: "favorite-items", element: <div>CRUD Favorite Items (En construcción)</div> },
            { path: "favorite-promotions", element: <div>CRUD Favorite Promotions (En construcción)</div> },
            { path: "conversations", element: <div>CRUD Conversations (En construcción)</div> },
            { path: "messages", element: <div>CRUD Messages (En construcción)</div> },
        ]
    }
]);
