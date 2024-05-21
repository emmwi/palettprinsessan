

 CREATE TABLE patterns (
  pattern_id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  pdf TEXT NOT NULL,
  price NUMERIC NOT NULL
);

 INSERT INTO patterns (name, image, pdf, description, price) VALUES  ('HöstMittens (malbrigo)', 'mittensMalabrigo.png', 'HöstMittens-malabrigoWorsted.pdf', 'Vantar i Malabrio Worsted, stickade med stickor 5 och 6mm ', '45' );

 INSERT INTO patterns (name, image, pdf, description, price) VALUES  ('HöstMittens', 'mittensLateralBraid.jpg', 'mittens-lateral-fläta.pdf', 'Vantar i handfärgat kamelgarn från adlibris, stickade med stickor 4 och 5mm ', '45' );


 CREATE TABLE knitwear (
  knitwear_id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL
);

 INSERT INTO knitwear (name, image, description, price) VALUES  ('Pullover)', 'red_pullover.png', 'Stickad i du store alpakka tweed, storlek M', '1500');

 INSERT INTO knitwear(name, image, description, price) VALUES  ('BabyMössa, nyfödd- ca tre månader', 'babyhat_lemon.png', 'Mjuk baby-mössa stickat i handfärgat garn, baby Alpacka från Adlibris .', '250' );



 INSERT INTO projects (name, description, image) VALUES  ('baby blancet',  'stickat i baby alpacka, garn från adlibris', 'babyblanket.jpg');

INSERT INTO projects (name, description, image) VALUES  ('Patentstickat pannband med twist',  'stickat i Malabrigo Worsted', 'pannbandet.jpg');


CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    CHECK (LENGTH(password::TEXT) >= 6)
); // VARCHAR tillåter både nummer och text

INSERT INTO admin (name, password) VALUES ('emmaMWith', 'Q07xId027t');

CREATE TABLE adminToken (
    admin_id INTEGER,
    token VARCHAR PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES admin(id)
);



- Skapa tabellen för varukorgen
  CREATE TABLE carts (
      cart_id SERIAL PRIMARY KEY,
      session_id VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- Skapa tabellen för alla objekt (knitwear och patterns)
 -- Type =Typen av objekt: knitwear eller patterns
  -- För patterns
CREATE TABLE items (
  item_id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  pdf TEXT,
  price NUMERIC NOT NULL,
  type TEXT NOT NULL
);


CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);
