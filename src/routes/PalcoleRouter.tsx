import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainPage from "../pages/MainPage";
import AllUsersPage from "../pages/users/AllUsersPage";
import InsertUserPage from "../pages/users/InsertUserPage";
import UserDetailPage from "../pages/users/UserDetailPage";
import UpdateUserPage from "../pages/users/UpdateUserPage";
import AllRolesPage from "../pages/roles/AllRolesPage";
import InsertRolePage from "../pages/roles/InsertRolePage";
import RoleDetailPage from "../pages/roles/RoleDetailPage";
import UpdateRolePage from "../pages/roles/UpdateRolePage";
import AllCategoriesPage from "../pages/categories/AllCategoriesPage";
import InsertCategoryPage from "../pages/categories/InsertCategoryPage";
import CategoryDetailPage from "../pages/categories/CategoryDetailPage";
import UpdateCategoryPage from "../pages/categories/UpdateCategoryPage";
import AllAcademicItemsPage from "../pages/academic-items/AllAcademicItemsPage";
import InsertAcademicItemPage from "../pages/academic-items/InsertAcademicItemPage";
import AcademicItemDetailPage from "../pages/academic-items/AcademicItemDetailPage";
import UpdateAcademicItemPage from "../pages/academic-items/UpdateAcademicItemPage";
import AllPromotionsPage from "../pages/promotions/AllPromotionsPage";
import InsertPromotionPage from "../pages/promotions/InsertPromotionPage";
import PromotionDetailPage from "../pages/promotions/PromotionDetailPage";
import UpdatePromotionPage from "../pages/promotions/UpdatePromotionPage";
import AllFavoriteItemsPage from "../pages/favorite-items/AllFavoriteItemsPage";
import InsertFavoriteItemPage from "../pages/favorite-items/InsertFavoriteItemPage";
import FavoriteItemDetailPage from "../pages/favorite-items/FavoriteItemDetailPage";
import UpdateFavoriteItemPage from "../pages/favorite-items/UpdateFavoriteItemPage";
import AllFavoritePromotionsPage from "../pages/favorite-promotions/AllFavoritePromotionsPage";
import InsertFavoritePromotionPage from "../pages/favorite-promotions/InsertFavoritePromotionPage";
import FavoritePromotionDetailPage from "../pages/favorite-promotions/FavoritePromotionDetailPage";
import UpdateFavoritePromotionPage from "../pages/favorite-promotions/UpdateFavoritePromotionPage";
import AllConversationsPage from "../pages/conversations/AllConversationsPage";
import InsertConversationPage from "../pages/conversations/InsertConversationPage";
import ConversationDetailPage from "../pages/conversations/ConversationDetailPage";
import UpdateConversationPage from "../pages/conversations/UpdateConversationPage";
import AllMessagesPage from "../pages/messages/AllMessagesPage";
import InsertMessagePage from "../pages/messages/InsertMessagePage";
import MessageDetailPage from "../pages/messages/MessageDetailPage";
import UpdateMessagePage from "../pages/messages/UpdateMessagePage";

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
