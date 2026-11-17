export interface PromotionInput {
    category_id: number;
    title: string;
    description: string;
    original_price: number;
    discount_price: number;
    discount_percentage: number;
    promo_code: string;
    start_date: string;
    end_date: string;
}
