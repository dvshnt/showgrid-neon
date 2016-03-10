## Database Colation

For default db setting:
ALTER DATABASE sgdb_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


For altering existing tables:
ALTER TABLE tbl_name CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;