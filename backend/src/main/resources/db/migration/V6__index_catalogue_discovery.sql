CREATE INDEX idx_products_active_category_name
    ON products (category_id, name, id)
    WHERE active = TRUE;

CREATE INDEX idx_products_active_price
    ON products (price, id)
    WHERE active = TRUE;
