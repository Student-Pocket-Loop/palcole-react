export interface AcademicItem {
    item_id: number;
    student_id: number;
    category_id: number;
    title: string;
    description: string;
    price: number;
    item_condition: string;
    listing_type: string;
    sale_status: string;
    published_at: string;
    image_url: string | null;
}
