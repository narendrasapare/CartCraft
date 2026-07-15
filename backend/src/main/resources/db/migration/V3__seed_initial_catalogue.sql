INSERT INTO categories (name, slug)
VALUES
    ('Electronics', 'electronics'),
    ('Accessories', 'accessories');

INSERT INTO products (
    name,
    slug,
    description,
    price,
    image_url,
    category_id
)
VALUES
    (
        'Wireless Headphones',
        'wireless-headphones',
        'Comfortable wireless headphones for everyday listening.',
        2999.00,
        '/images/products/wireless-headphones.webp',
        (SELECT id FROM categories WHERE slug = 'electronics')
    ),
    (
        'Mechanical Keyboard',
        'mechanical-keyboard',
        'Compact mechanical keyboard designed for work and gaming.',
        4499.00,
        '/images/products/mechanical-keyboard.webp',
        (SELECT id FROM categories WHERE slug = 'electronics')
    ),
    (
        'Everyday Backpack',
        'everyday-backpack',
        'Lightweight backpack with space for a laptop and daily essentials.',
        1899.00,
        '/images/products/everyday-backpack.webp',
        (SELECT id FROM categories WHERE slug = 'accessories')
    );