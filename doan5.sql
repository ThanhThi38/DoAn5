CREATE TABLE categories(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    sort_order TINYINT,
    status BIT NOT NULL,
)

CREATE TABLE products(
    id int IDENTITY(1, 1) PRIMARY KEY,
    category_id INT CONSTRAINT fk_category_id FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(250) NOT NULL,
    slug VARCHAR(250) NOT NULL,
    price INT NOT NULL,
    sale TINYINT,
    description NTEXT,
    content NTEXT,
    status BIT NOT NULL,
)

CREATE TABLE images(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    product_id INT CONSTRAINT fk_product_id FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(MAX) NOT NULL,
)

CREATE TABLE options(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    product_id INT CONSTRAINT fk_product_option FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    name NVARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
)

CREATE TABLE customers(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    image VARCHAR(200),
    phone CHAR(10) NOT NULL,
    email VARCHAR(70),
    password VARCHAR(250) NOT NULL,
)

CREATE TABLE addresses(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    phone CHAR(10) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    customer_id INT CONSTRAINT fk_customer_address FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    active BIT
)

CREATE TABLE payment_methods(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(MAX) NOT NULL,
    description NTEXT,
    image varchar(200)
)

CREATE TABLE orders(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    customer_id INT CONSTRAINT fk_customer_oder FOREIGN KEY(customer_id) REFERENCES customers(id),
    address_id INT CONSTRAINT fk_address_oder FOREIGN KEY(address_id) REFERENCES shipping_address(id) ON DELETE CASCADE,
    created_at datetime NOT NULL,
    payment_id INT CONSTRAINT fk_oder_payment FOREIGN KEY(payment_id) REFERENCES payment_methods(id),
    status TINYINT NOT NULL,
)

CREATE TABLE detail_orders(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    order_id INT CONSTRAINT fk_order_detail FOREIGN KEY(order_id) REFERENCES order_id(id) ON DELETE CASCADE,
    name NVARCHAR(250),
    option_name VARCHAR(100),
    image VARCHAR(200),
    quantity INT NOT NULL,
    price INT NOT NULL
)

CREATE TABLE users(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    image VARCHAR(200),
    email VARCHAR(70) NOT NULL,
    password VARCHAR(50) NOT NULL,
    phone char(10)
)

CREATE TABLE roles(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(MAX)
)

CREATE TABLE user_role(
    user_id int CONSTRAINT fk_role_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    role_id int CONSTRAINT fk_user_role FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
)

CREATE TABLE functions(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    url VARchar(MAX),
    parent_id INT,
    sort_order TINYINT,
    status TINYINT,
)

CREATE TABLE permissions(
    role_id INT CONSTRAINT fk_role_permission FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
    function_id INT CONSTRAINT fk_function_permission FOREIGN KEY(function_id) REFERENCES functions(id) ON DELETE CASCADE,
    action_id INT
)

CREATE TABLE carts(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    customer_id INT CONSTRAINT fk_customer_cart FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    product_id  INT CONSTRAINT fk_cart_product FOREIGN KEY(product_id) REFERENCES products(id),
    option_name VARCHAR(200),
    quantity INT NOT NULL
)

CREATE TABLE slides(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(200) NOT NUll,
    url VARCHAR(250),
)

CREATE TABLE contact(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    logo VARCHAR(200),
    name NVARCHAR(MAX),
    work_time NVARCHAR(200),
    hotline CHAR(12),
    address NVARCHAR(MAX),
    content NTEXT
)

CREATE TABLE banners(
    id INT IDENTITY,
    name VARCHAR(200)
)

Create TABLE shipping_address (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    phone CHAR(10) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
)
