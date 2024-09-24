UPDATE category SET color = '#4F46E5' WHERE description = 'Food & Restaurants' AND color <> '#4F46E5';
INSERT INTO category (description, color) SELECT 'Food & Restaurants', '#4F46E5' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Food & Restaurants' );

UPDATE category SET color = '#1EB3DB' WHERE description = 'Car' AND color <> '#1EB3DB';
INSERT INTO category (description, color) SELECT 'Car', '#1EB3DB' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Car' );

UPDATE category SET color = '#E83FAB' WHERE description = 'Subscriptions' AND color <> '#E83FAB';
INSERT INTO category (description, color) SELECT 'Subscriptions', '#E83FAB' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Subscriptions' );

UPDATE category SET color = '#FF8084' WHERE description = 'Entertainment' AND color <> '#FF8084';
INSERT INTO category (description, color) SELECT 'Entertainment', '#FF8084' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Entertainment' );

UPDATE category SET color = '#9FD11F' WHERE description = 'Coffee' AND color <> '#9FD11F';
INSERT INTO category (description, color) SELECT 'Coffee', '#9FD11F' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Coffee' );

UPDATE category SET color = '#FFA500' WHERE description = 'Saving' AND color <> '#FFA500';
INSERT INTO category (description, color) SELECT 'Saving', '#FFA500' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Saving' );

UPDATE category SET color = '#FFD700' WHERE description = 'Education' AND color <> '#FFD700';
INSERT INTO category (description, color) SELECT 'Education', '#FFD700' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Education' );

UPDATE category SET color = '#FF69B4' WHERE description = 'Clothing' AND color <> '#FF69B4';
INSERT INTO category (description, color) SELECT 'Clothing', '#FF69B4' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Clothing' );

UPDATE category SET color = '#8B4513' WHERE description = 'Housing' AND color <> '#8B4513';
INSERT INTO category (description, color) SELECT 'Housing', '#8B4513' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Housing' );

UPDATE category SET color = '#FF6347' WHERE description = 'Health' AND color <> '#FF6347';
INSERT INTO category (description, color) SELECT 'Health', '#FF6347' WHERE NOT EXISTS ( SELECT 1 FROM category WHERE description = 'Health' );



INSERT INTO currency (code) SELECT 'RON' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'RON' );
INSERT INTO currency (code) SELECT 'MDL' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'MDL' );
INSERT INTO currency (code) SELECT 'EUR' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'EUR' );
INSERT INTO currency (code) SELECT 'USD' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'USD' );
INSERT INTO currency (code) SELECT 'GBP' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'GBP' );
INSERT INTO currency (code) SELECT 'CAD' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'CAD' );
INSERT INTO currency (code) SELECT 'CHF' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'CHF' );
INSERT INTO currency (code) SELECT 'HUF' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'HUF' );
INSERT INTO currency (code) SELECT 'CZK' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'CZK' );
INSERT INTO currency (code) SELECT 'PLN' WHERE NOT EXISTS ( SELECT 1 FROM currency WHERE code = 'PLN' );
