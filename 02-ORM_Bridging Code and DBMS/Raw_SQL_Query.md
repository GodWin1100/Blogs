# Raw SQL Queries

## User Table

```sql
CREATE TABLE
  `cms`.`user` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(45) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`user_id`)
  );
```

```sql
INSERT INTO
  `cms`.`user` (user_name, email)
VALUES
  ('Johnny', 'johnny@example.com'),
  ('Jane', 'jane@example.com'),
  ('Bravo', 'bravo@example.com'),
  ('Doe', 'doe@example.com'),
  ('Mary', 'mary@example.com'),
  ('Lisa', 'lisa@example.com'),
  ('Raj', 'raj@example.com'),
  ('Suraj', 'suraj@example.com'),
  ('Emma', 'emma@example.com'),
  ('Ivan', 'ivan@example.com');
```

```sql
SELECT
  *
FROM
  user;
```

| user_id | user_name | email              |
| ------: | :-------- | :----------------- |
|       1 | Johnny    | johnny@example.com |
|       2 | Jane      | jane@example.com   |
|       3 | Bravo     | bravo@example.com  |
|       4 | Doe       | doe@example.com    |
|       5 | Mary      | mary@example.com   |
|       6 | Lisa      | lisa@example.com   |
|       7 | Raj       | raj@example.com    |
|       8 | Suraj     | suraj@example.com  |
|       9 | Emma      | emma@example.com   |
|      10 | Ivan      | ivan@example.com   |

## Secret Table

```sql
CREATE TABLE
  `cms`.`secret` (
    `secret_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT UNIQUE NOT NULL,
    `password` VARCHAR(45) NOT NULL,
    `expiry_date` DATE NOT NULL,
    PRIMARY KEY (`secret_id`),
    FOREIGN KEY (`user_id`) REFERENCES `cms`.`user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
  );
```

```sql
INSERT INTO
  `cms`.`secret` (user_id, password, expiry_date)
VALUES
  (1, 'Johnny_hashed_pw', '2023-10-10'),
  (2, 'Jane_hashed_pw', '2023-10-15'),
  (3, 'Bravo_hashed_pw', '2023-10-11'),
  (4, 'Doe_hashed_pw', '2023-11-6'),
  (5, 'Mary_hashed_pw', '2023-11-20'),
  (6, 'Lisa_hashed_pw', '2023-12-05'),
  (7, 'Raj_hashed_pw', '2023-11-28'),
  (8, 'Suraj_hashed_pw', '2023-11-30'),
  (9, 'Emma_hashed_pw', '2023-12-15'),
  (10, 'Ivan_hashed_pw', '2023-12-6');
```

```sql
SELECT
  *
FROM
  `cms`.`user`
  JOIN `cms`.`secret` USING (user_id)
WHERE
  expiry_date < "2023-11-01";
```

| user_id | user_name | email              | secret_id | password         | expiry_date |
| ------: | :-------- | :----------------- | --------: | :--------------- | :---------- |
|       1 | Johnny    | johnny@example.com |         1 | Johnny_hashed_pw | 2023-10-10  |
|       2 | Jane      | jane@example.com   |         2 | Jane_hashed_pw   | 2023-10-15  |
|       3 | Bravo     | bravo@example.com  |         3 | Bravo_hashed_pw  | 2023-10-11  |

## Role Table

```sql
CREATE TABLE
  `cms`.`role` (
    `role_id` INT NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(150) UNIQUE NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`role_id`)
  );
```

```sql
INSERT INTO
  `cms`.`role` (role_name, description)
VALUES
  ('Administrator', 'Root role with all permissions'),
  (
    'Editor',
    'Publish, edit, view, comment and moderate comments'
  ),
  ('Author', 'Create articles, view and comment'),
  (
    'Contributor',
    'Contribute articles for other author, view and comment'
  ),
  ('Viewer', 'Able to view and comment');
```

```sql
SELECT
  *
FROM
  role;
```

| role_id | role_name     | description                                            |
| ------: | :------------ | :----------------------------------------------------- |
|       1 | Administrator | Root role with all permissions                         |
|       2 | Editor        | Publish, edit, view, comment and moderate comments     |
|       3 | Author        | Create articles, view and comment                      |
|       4 | Contributor   | Contribute articles for other author, view and comment |
|       5 | Viewer        | Able to view and comment                               |

## Permission Table

```sql
CREATE TABLE
  `cms`.`permission` (
    `permission_id` INT NOT NULL,
    `permission_name` VARCHAR(45) UNIQUE NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`permission_id`)
  );
```

```sql
INSERT INTO
  `cms`.`permission` (permission_name, description)
VALUES
  (
    'MyContent',
    'Create, edit and delete own contents'
  ),
  ('Create', 'Create content'),
  ('Publish', 'Publish content'),
  ('Edit', 'Edit Content'),
  ('Delete', 'Delete Content'),
  ('View', 'View Content'),
  ('MyComment', 'Add, edit and delete own comments'),
  (
    'Moderate Comment',
    'Edit or delete other''s comments'
  ),
  ('Manage User', 'Add or remove users'),
  ('Manage Role', 'Add, edit and remove roles'),
  ('Analytics', 'Access to analysis');
```

```sql
SELECT
  *
FROM
  permission;
```

| permission_id | permission_name  | description                          |
| ------------: | :--------------- | :----------------------------------- |
|             1 | MyContent        | Create, edit and delete own contents |
|             2 | Create           | Create content                       |
|             3 | Publish          | Publish content                      |
|             4 | Edit             | Edit Content                         |
|             5 | Delete           | Delete Content                       |
|             6 | View             | View Content                         |
|             7 | MyComment        | Add, edit and delete own comments    |
|             8 | Moderate Comment | Edit or delete other's comments      |
|             9 | Manage User      | Add or remove users                  |
|            10 | Manage Role      | Add, edit and remove roles           |
|            11 | Analytics        | Access to analysis                   |

## Role Permission Table

```sql
CREATE TABLE
  `cms`.`role_permission` (
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    FOREIGN KEY (`role_id`) REFERENCES `cms`.`role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (`permission_id`) REFERENCES `cms`.`permission` (`permission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  );
```

```sql
INSERT INTO
  `cms`.`role_permission` (role_id, permission_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (1, 9),
  (1, 10),
  (1, 11),
  (2, 3),
  (2, 4),
  (2, 6),
  (2, 7),
  (2, 8),
  (3, 1),
  (3, 6),
  (3, 7),
  (4, 2),
  (4, 6),
  (4, 7),
  (5, 6),
  (5, 7);
```

```sql
SELECT
  role_id,
  permission_id,
  role_name,
  permission_name
FROM
  role_permission
  JOIN role USING (role_id)
  JOIN permission USING (permission_id);
```

| role_id | permission_id | role_name     | permission_name  |
| ------: | ------------: | :------------ | :--------------- |
|       1 |             1 | Administrator | MyContent        |
|       1 |             2 | Administrator | Create           |
|       1 |             3 | Administrator | Publish          |
|       1 |             4 | Administrator | Edit             |
|       1 |             5 | Administrator | Delete           |
|       1 |             6 | Administrator | View             |
|       1 |             7 | Administrator | MyComment        |
|       1 |             8 | Administrator | Moderate Comment |
|       1 |             9 | Administrator | Manage User      |
|       1 |            10 | Administrator | Manage Role      |
|       1 |            11 | Administrator | Analytics        |
|       3 |             1 | Author        | MyContent        |
|       3 |             6 | Author        | View             |
|       3 |             7 | Author        | MyComment        |
|       4 |             2 | Contributor   | Create           |
|       4 |             6 | Contributor   | View             |
|       4 |             7 | Contributor   | MyComment        |
|       2 |             3 | Editor        | Publish          |
|       2 |             4 | Editor        | Edit             |
|       2 |             6 | Editor        | View             |
|       2 |             7 | Editor        | MyComment        |
|       2 |             8 | Editor        | Moderate Comment |
|       5 |             6 | Viewer        | View             |
|       5 |             7 | Viewer        | MyComment        |

## User Role Table

```sql
CREATE TABLE
  `cms`.`user_role` (
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `cms`.`user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (`role_id`) REFERENCES `cms`.`role` (`role_id`) ON DELETE CASCADE ON UPDATE NO ACTION
  );
```

```sql
INSERT INTO
  `cms`.`user_role` (user_id, role_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 5),
  (4, 3),
  (5, 3),
  (6, 4),
  (7, 3),
  (8, 4),
  (9, 5),
  (10, 2);
```

```sql
SELECT
  *
FROM
  user_role
  JOIN user USING (user_id)
  JOIN role USING (role_id)
ORDER BY
  user_id;
```

| role_id | user_id | user_name | email              | role_name     | description                                            |
| ------: | ------: | :-------- | :----------------- | :------------ | :----------------------------------------------------- |
|       1 |       1 | Johnny    | johnny@example.com | Administrator | Root role with all permissions                         |
|       2 |       2 | Jane      | jane@example.com   | Editor        | Publish, edit, view, comment and moderate comments     |
|       5 |       3 | Bravo     | bravo@example.com  | Viewer        | Able to view and comment                               |
|       3 |       4 | Doe       | doe@example.com    | Author        | Create articles, view and comment                      |
|       3 |       5 | Mary      | mary@example.com   | Author        | Create articles, view and comment                      |
|       4 |       6 | Lisa      | lisa@example.com   | Contributor   | Contribute articles for other author, view and comment |
|       3 |       7 | Raj       | raj@example.com    | Author        | Create articles, view and comment                      |
|       4 |       8 | Suraj     | suraj@example.com  | Contributor   | Contribute articles for other author, view and comment |
|       5 |       9 | Emma      | emma@example.com   | Viewer        | Able to view and comment                               |
|       2 |      10 | Ivan      | ivan@example.com   | Editor        | Publish, edit, view, comment and moderate comments     |

## Content Table

```sql
CREATE TABLE
  `cms`.`content` (
    `content_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `contributor_id` INT,
    `title` VARCHAR(45) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`content_id`),
    FOREIGN KEY (`user_id`) REFERENCES `cms`.`user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (`contributor_id`) REFERENCES `cms`.`user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  );
```

```sql
INSERT INTO
  `cms`.`content` (user_id, contributor_id, title, content)
VALUES
  (
    4,
    NULL,
    'RDBMS Relation',
    'Relation between DBMS entities'
  ),
  (5, NULL, 'Phoenix', 'Rising from the ash.'),
  (
    4,
    NULL,
    'Git',
    'Git is SCM(Source Control Management)'
  ),
  (
    5,
    6,
    'Shell on Rabbit',
    'OS independent Shell customization'
  ),
  (7, 8, 'NoSQL', 'Concealed Schema DBMS'),
  (
    5,
    8,
    'Docker',
    'Developing, shipping and running containers'
  );
```

```sql
SELECT
  c.content_id,
  c.title,
  c.content,
  u1.user_name AS author,
  u2.user_name AS contributor
FROM
  content c
  JOIN user u1 USING (user_id)
  LEFT JOIN user u2 ON c.contributor_id = u2.user_id;
```

| content_id | title           | content                                     | author | contributor |
| ---------: | :-------------- | :------------------------------------------ | :----- | :---------- |
|          1 | RDBMS Relation  | Relation between DBMS entities              | Doe    | NULL        |
|          2 | Phoenix         | Rising from the ash.                        | Mary   | NULL        |
|          3 | Git             | Git is SCM(Source Control Management)       | Doe    | NULL        |
|          4 | Shell on Rabbit | OS independent Shell customization          | Mary   | Lisa        |
|          5 | NoSQL           | Concealed Schema DBMS                       | Raj    | Suraj       |
|          6 | Docker          | Developing, shipping and running containers | Mary   | Suraj       |

## Comment Table

```sql
CREATE TABLE
  `cms`.`comment` (
    `comment_id` INT NOT NULL AUTO_INCREMENT,
    `content_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `comment` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    PRIMARY KEY (`comment_id`),
    FOREIGN KEY (`content_id`) REFERENCES `cms`.`content` (`content_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (`user_id`) REFERENCES `cms`.`user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  );
```

```sql
INSERT INTO
  `cms`.`comment` (content_id, user_id, comment, date)
VALUES
  (1, 1, "Nice Pick", "2023-10-03"),
  (1, 4, "Thank You", "2023-10-03"),
  (3, 9, "Git is surely essential", "2023-10-15"),
  (
    6,
    6,
    "To the point contributed by Suraj",
    "2023-10-23"
  ),
  (
    6,
    6,
    "Wish to keep it small and concise",
    "2023-10-24"
  ),
  (
    2,
    5,
    "Like, share and follow for more",
    "2023-10-25"
  );
```

```sql
SELECT
  c.comment_id,
  co.title,
  user.user_name AS author,
  u.user_name AS commenter,
  c.comment,
  c.date
FROM
  comment c
  JOIN user u USING (user_id)
  JOIN content co USING (content_id)
  JOIN user ON co.user_id = user.user_id;
```

| comment_id | title          | author | commenter | comment                           | date       |
| ---------: | :------------- | :----- | :-------- | :-------------------------------- | :--------- |
|          1 | RDBMS Relation | Doe    | Johnny    | Nice Pick                         | 2023-10-03 |
|          2 | RDBMS Relation | Doe    | Doe       | Thank You                         | 2023-10-03 |
|          3 | Git            | Doe    | Emma      | Git is surely essential           | 2023-10-15 |
|          4 | Docker         | Mary   | Lisa      | To the point contributed by Suraj | 2023-10-23 |
|          5 | Docker         | Mary   | Suraj     | Wish to keep it small and concise | 2023-10-24 |
|          6 | Phoenix        | Mary   | Mary      | Like, share and follow for more   | 2023-10-25 |

## Reach Out

For more intuitive blogs follow me on Medium & Github. You can also reach out to me via LinkedIn or X(Twitter).

[![Shivam Panchal | LinkedIn](https://img.shields.io/badge/Shivam_Panchal-eeeeee?style=for-the-badge&logo=linkedin&logoColor=ffffff&labelColor=0A66C2)][reach_linkedin]
[![l_shivam_l | X](https://img.shields.io/badge/l__shivam__l-eeeeee?style=for-the-badge&logo=x&logoColor=ffffff&labelColor=000000)][reach_x]
[![GodWin1100 | GitHub](https://img.shields.io/badge/Godwin1100-eeeeee?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=181717)][reach_github]
[![GodWin | Medium](https://img.shields.io/badge/Shivam_Panchal-eeeeee?style=for-the-badge&logo=medium&logoColor=ffffff&labelColor=000000)][reach_medium]

[reach_linkedin]: https://www.linkedin.com/in/godwin1100
[reach_x]: https://twitter.com/l_shivam_l
[reach_medium]: https://medium.com/@godwin1100
[reach_github]: https://github.com/GodWin1100
