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
import AllPromotionsPage from "../pages/AllPromotionsPage";
import InsertPromotionPage from "../pages/InsertPromotionPage";
import PromotionDetailPage from "../pages/PromotionDetailPage";
import UpdatePromotionPage from "../pages/UpdatePromotionPage";
import AllFavoriteItemsPage from "../pages/AllFavoriteItemsPage";
import InsertFavoriteItemPage from "../pages/InsertFavoriteItemPage";
import FavoriteItemDetailPage from "../pages/FavoriteItemDetailPage";
import UpdateFavoriteItemPage from "../pages/UpdateFavoriteItemPage";
import AllFavoritePromotionsPage from "../pages/AllFavoritePromotionsPage";
import InsertFavoritePromotionPage from "../pages/InsertFavoritePromotionPage";
import FavoritePromotionDetailPage from "../pages/FavoritePromotionDetailPage";
import UpdateFavoritePromotionPage from "../pages/UpdateFavoritePromotionPage";
import AllConversationsPage from "../pages/AllConversationsPage";
import InsertConversationPage from "../pages/InsertConversationPage";
import ConversationDetailPage from "../pages/ConversationDetailPage";
import UpdateConversationPage from "../pages/UpdateConversationPage";
import AllMessagesPage from "../pages/AllMessagesPage";
import InsertMessagePage from "../pages/InsertMessagePage";
import MessageDetailPage from "../pages/MessageDetailPage";
import UpdateMessagePage from "../pages/UpdateMessagePage";

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
            
            { path: "promotions", element: <AllPromotionsPage /> },
            { path: "promotions/new", element: <InsertPromotionPage /> },
            { path: "promotions/:id", element: <PromotionDetailPage /> },
            { path: "promotions/edit/:id", element: <UpdatePromotionPage /> },
            
            { path: "favorite-items", element: <AllFavoriteItemsPage /> },
            { path: "favorite-items/new", element: <InsertFavoriteItemPage /> },
            { path: "favorite-items/:userId/:itemId", element: <FavoriteItemDetailPage /> },
            { path: "favorite-items/edit/:userId/:itemId", element: <UpdateFavoriteItemPage /> },
            
            { path: "favorite-promotions", element: <AllFavoritePromotionsPage /> },
            { path: "favorite-promotions/new", element: <InsertFavoritePromotionPage /> },
            { path: "favorite-promotions/:userId/:promotionId", element: <FavoritePromotionDetailPage /> },
            { path: "favorite-promotions/edit/:userId/:promotionId", element: <UpdateFavoritePromotionPage /> },
            
            { path: "conversations", element: <AllConversationsPage /> },
            { path: "conversations/new", element: <InsertConversationPage /> },
            { path: "conversations/:id", element: <ConversationDetailPage /> },
            { path: "conversations/edit/:id", element: <UpdateConversationPage /> },
            
            { path: "messages", element: <AllMessagesPage /> },
            { path: "messages/new", element: <InsertMessagePage /> },
            { path: "messages/:id", element: <MessageDetailPage /> },
            { path: "messages/edit/:id", element: <UpdateMessagePage /> }
        ]
    }
]);
