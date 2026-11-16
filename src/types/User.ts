export interface User {
    user_id: number;
    role_id: number;
    username: string;
    email: string;
    password_hash: string;
    educational_center: string;
    is_verified: boolean;
    registration_date: string;
    expiration_date: string | null;
    is_active: boolean;
}
