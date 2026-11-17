import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";
import AllUsersPage from "../pages/AllUsersPage";
import InsertUserPage from "../pages/InsertUserPage";
import UserDetailPage from "../pages/UserDetailPage";
import UpdateUserPage from "../pages/UpdateUserPage";
import AllRolesPage from "../pages/AllRolesPage";
import InsertRolePage from "../pages/InsertRolesPage";
import RoleDetailPage from "../pages/RoleDetailPage";
import UpdateRolePage from "../pages/UpdateRolePage";
import AllCategoriesPage from "../pages/AllCategoriesPage";
import InsertCategoryPage from "../pages/InsertCategoryPage";
import CategoryDetailPage from "../pages/CategoryDetailPage";
import UpdateCategoryPage from "../pages/UpdateCategoryPage";
import AllAcademicItemsPage from "../pages/AllAcademicItemsPage";
import InsertAcademicItemPage from "../pages/InsertAcademicItemPage";
import AcademicItemDetailPage from "../pages/AcademicItemDetailPage";
import UpdateAcademicItemPage from "../pages/UpdateAcademicItemPage";

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

            { path: "roles", element: <AllRolesPage /> },
            { path: "roles/new", element: <InsertRolePage /> },
            { path: "roles/:id", element: <RoleDetailPage /> },
            { path: "roles/edit/:id", element: <UpdateRolePage /> },

            { path: "categories", element: <AllCategoriesPage /> },
            { path: "categories/new", element: <InsertCategoryPage /> },
            { path: "categories/:id", element: <CategoryDetailPage /> },
            { path: "categories/edit/:id", element: <UpdateCategoryPage /> },

            { path: "academic-items", element: <AllAcademicItemsPage /> },
            { path: "academic-items/new", element: <InsertAcademicItemPage /> },
            { path: "academic-items/:id", element: <AcademicItemDetailPage /> },
            { path: "academic-items/edit/:id", element: <UpdateAcademicItemPage /> },
            
            { path: "promotions", element: <div>CRUD Promotions (En construcción)</div> },
            
            { path: "favorite-items", element: <div>CRUD Favorite Items (En construcción)</div> },
            
            { path: "favorite-promotions", element: <div>CRUD Favorite Promotions (En construcción)</div> },
            
            { path: "conversations", element: <div>CRUD Conversations (En construcción)</div> },
            
            { path: "messages", element: <div>CRUD Messages (En construcción)</div> },
        ]
    }
]);
