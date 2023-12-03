# Sequelize: NodeJs Active Record ORM

Code Script: [NodeJs_Sequelize.mjs](./NodeJs_Sequelize.mjs)

## Required libraries

> npm install mysql2 sequelize

## Import from Sequelize

```js
import { DataTypes, Model, Op, Sequelize } from "sequelize";

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_host = process.env.DB_HOST;
const db_name = "cms_js";

/**
 * Generates a text section with padding using a specified fill character.
 *
 * @param {string} text - The text content of the section.
 * @param {string} [fillChar="="] - The character used to fill the padding.
 * @param {number} [width=100] - The total width of the section (including text and padding).
 * @returns {void}
 */
const section = (text, fillChar = "=", width = 100) => {
  const padding = Math.max(0, width - text.length);
  const leftPadding = Math.floor(padding / 2);
  const rightPadding = padding - leftPadding;
  console.log(
    fillChar.repeat(leftPadding) + text + fillChar.repeat(rightPadding)
  );
};
```

## Initialize Engine with dialect and DB engine

- Ref:
  - Getting Started: https://sequelize.org/docs/v6/getting-started/
  - API Reference: https://sequelize.org/api/v6/identifiers

```js
// Option 1: Passing a connection URI
const sequelize = new Sequelize(
  `mysql://${db_user}:${db_pass}@${db_host}/${db_name}`,
  {
    define: {
      freezeTableName: true, // will use defined table name only without plurals
      timestamps: false,
    }, // will not add timestamps
  }
);
```

```js
// Option 2: Passing parameters separately
const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "mysql",
});
```

## Testing Connection

```js
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
```

OUTPUT

```bash
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

## Table Definitions

- Ref:
  - Model Basic: https://sequelize.org/docs/v6/core-concepts/model-basics/

```js
class Role extends Model {}
Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { sequelize, modelName: "role" }
);

class Permission extends Model {}
Permission.init(
  {
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permission_name: {
      type: DataTypes.STRING(45),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { sequelize, modelName: "permission" }
);

class User extends Model {}
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
  },
  { sequelize, modelName: "user", timestamps: true } // we want timestamps
);

class Secret extends Model {}
Secret.init(
  {
    secret_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, modelName: "secret" }
);

class Content extends Model {}
Content.init(
  {
    content_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { sequelize, modelName: "content" }
);

class Comment extends Model {}
Comment.init(
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, modelName: "comment" }
);

class RolePermission extends Model {}
RolePermission.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      // primaryKey: true, // No need as below we defined this as foreign_key which will add primary key and unique key constraint
      references: {
        model: Role,
        key: "role_id",
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      // primaryKey: true, // No need as below we defined this as foreign_key which will add primary key and unique key constraint
      references: {
        model: Permission,
        key: "permission_id",
      },
    },
  },
  { sequelize, modelName: "role_permission" }
);
```

## Define associations/joins

- Ref:
  - Associations/Joins: https://sequelize.org/docs/v6/core-concepts/assocs
  - Many-to-many: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
  - Multiple Association: https://sequelize.org/docs/v6/core-concepts/assocs/#multiple-associations-involving-the-same-models
  - Pair Association Definitions: https://sequelize.org/docs/v6/core-concepts/assocs/#why-associations-are-defined-in-pairs

```js
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
});

User.belongsToMany(Role, { through: "user_role", foreignKey: "user_id" });
Role.belongsToMany(User, { through: "user_role", foreignKey: "role_id" });

User.hasOne(Secret, {
  foreignKey: { name: "user_id", allowNull: false, unique: true },
});
Secret.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Content, {
  foreignKey: { name: "user_id", allowNull: false },
});
Content.belongsTo(User, { foreignKey: "user_id" });

// ? https://sequelize.org/docs/v6/core-concepts/assocs/#multiple-associations-involving-the-same-models
User.hasMany(Content, { as: "Contributed", foreignKey: "contributor_id" });
Content.belongsTo(User, { as: "Contributor", foreignKey: "contributor_id" }); // need to define alias, as we are associating same model more than once

Content.hasMany(Comment, {
  foreignKey: { name: "content_id", allowNull: false },
});
Comment.belongsTo(Content, {
  foreignKey: { name: "content_id", allowNull: false }, // we can remove allowNull from here as well
});

// ? https://sequelize.org/docs/v6/core-concepts/assocs/#why-associations-are-defined-in-pairs
// No two way association as we don't want user.getComments method
Comment.belongsTo(User, {
  foreignKey: { name: "user_id", allowNull: false },
});
```

## Table Creation

- Ref:
  - Model Synchronization: https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization

```js
section("Start Synchronizing");
await sequelize.sync({ force: true }); // ! DON'T DROP TABLES IN PRODUCTION
section("All models were synchronized successfully.");
```

OUTPUT

```bash
========================================Start Synchronizing=========================================
Executing (default): DROP TABLE IF EXISTS `user_role`;
Executing (default): DROP TABLE IF EXISTS `role_permission`;
Executing (default): DROP TABLE IF EXISTS `comment`;
Executing (default): DROP TABLE IF EXISTS `content`;
Executing (default): DROP TABLE IF EXISTS `secret`;
Executing (default): DROP TABLE IF EXISTS `user`;
Executing (default): DROP TABLE IF EXISTS `permission`;
Executing (default): DROP TABLE IF EXISTS `role`;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'role' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'permission' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'user' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'secret' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'content' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'comment' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'role_permission' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): SELECT CONSTRAINT_NAME as constraint_name,CONSTRAINT_NAME as constraintName,CONSTRAINT_SCHEMA as constraintSchema,CONSTRAINT_SCHEMA as constraintCatalog,TABLE_NAME as tableName,TABLE_SCHEMA as tableSchema,TABLE_SCHEMA as tableCatalog,COLUMN_NAME as columnName,REFERENCED_TABLE_SCHEMA as referencedTableSchema,REFERENCED_TABLE_SCHEMA as referencedTableCatalog,REFERENCED_TABLE_NAME as referencedTableName,REFERENCED_COLUMN_NAME as referencedColumnName FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME = 'user_role' AND CONSTRAINT_NAME!='PRIMARY' AND CONSTRAINT_SCHEMA='cms_js' AND REFERENCED_TABLE_NAME IS NOT NULL;
Executing (default): DROP TABLE IF EXISTS `role`;
Executing (default): DROP TABLE IF EXISTS `permission`;
Executing (default): DROP TABLE IF EXISTS `user`;
Executing (default): DROP TABLE IF EXISTS `secret`;
Executing (default): DROP TABLE IF EXISTS `content`;
Executing (default): DROP TABLE IF EXISTS `comment`;
Executing (default): DROP TABLE IF EXISTS `role_permission`;
Executing (default): DROP TABLE IF EXISTS `user_role`;
Executing (default): DROP TABLE IF EXISTS `role`;
Executing (default): CREATE TABLE IF NOT EXISTS `role` (`role_id` INTEGER auto_increment , `role_name` VARCHAR(150) NOT NULL UNIQUE, `description` VARCHAR(255) NOT NULL, PRIMARY KEY (`role_id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `role`
Executing (default): DROP TABLE IF EXISTS `permission`;
Executing (default): CREATE TABLE IF NOT EXISTS `permission` (`permission_id` INTEGER auto_increment , `permission_name` VARCHAR(45) NOT NULL UNIQUE, `description` VARCHAR(255) NOT NULL, PRIMARY KEY (`permission_id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `permission`
Executing (default): DROP TABLE IF EXISTS `user`;
Executing (default): CREATE TABLE IF NOT EXISTS `user` (`user_id` INTEGER auto_increment , `user_name` VARCHAR(45) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`user_id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `user`
Executing (default): DROP TABLE IF EXISTS `secret`;
Executing (default): CREATE TABLE IF NOT EXISTS `secret` (`secret_id` INTEGER auto_increment , `password` VARCHAR(45) NOT NULL, `expiry_date` DATETIME NOT NULL, `user_id` INTEGER NOT NULL UNIQUE, PRIMARY KEY (`secret_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `secret`
Executing (default): DROP TABLE IF EXISTS `content`;
Executing (default): CREATE TABLE IF NOT EXISTS `content` (`content_id` INTEGER auto_increment , `title` VARCHAR(45) NOT NULL, `content` VARCHAR(255) NOT NULL, `user_id` INTEGER NOT NULL, `contributor_id` INTEGER, PRIMARY KEY (`content_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`contributor_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `content`
Executing (default): DROP TABLE IF EXISTS `comment`;
Executing (default): CREATE TABLE IF NOT EXISTS `comment` (`comment_id` INTEGER auto_increment , `comment` VARCHAR(255) NOT NULL, `date` DATETIME NOT NULL, `content_id` INTEGER NOT NULL, `user_id` INTEGER NOT NULL, PRIMARY KEY (`comment_id`), FOREIGN KEY (`content_id`) REFERENCES `content` (`content_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `comment`
Executing (default): DROP TABLE IF EXISTS `role_permission`;
Executing (default): CREATE TABLE IF NOT EXISTS `role_permission` (`role_id` INTEGER , `permission_id` INTEGER , UNIQUE `role_permission_permission_id_role_id_unique` (`role_id`, `permission_id`), PRIMARY KEY (`role_id`, `permission_id`), FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`permission_id`) REFERENCES `permission` (`permission_id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `role_permission`
Executing (default): DROP TABLE IF EXISTS `user_role`;
Executing (default): CREATE TABLE IF NOT EXISTS `user_role` (`user_id` INTEGER , `role_id` INTEGER , PRIMARY KEY (`user_id`, `role_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION, FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE ON UPDATE NO ACTION) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `user_role`
=============================All models were synchronized successfully.=============================
```

## Table: User & Secret

```js
section("Inserting USER & SECRET");
const users_data = [
  {
    user_name: "Johnny",
    email: "johnny@example.com",
    secret: { password: "Johnny_hashed_pw", expiry_date: "2023-10-10" },
  },
  {
    user_name: "Jane",
    email: "jane@example.com",
    secret: { password: "Jane_hashed_pw", expiry_date: "2023-10-15" },
  },
  {
    user_name: "Bravo",
    email: "bravo@example.com",
    secret: { password: "Bravo_hashed_pw", expiry_date: "2023-10-11" },
  },
  {
    user_name: "Doe",
    email: "doe@example.com",
    secret: { password: "Doe_hashed_pw", expiry_date: "2023-11-6" },
  },
  {
    user_name: "Mary",
    email: "mary@example.com",
    secret: { password: "Mary_hashed_pw", expiry_date: "2023-11-20" },
  },
  {
    user_name: "Lisa",
    email: "lisa@example.com",
    secret: { password: "Lisa_hashed_pw", expiry_date: "2023-12-05" },
  },
  {
    user_name: "Raj",
    email: "raj@example.com",
    secret: { password: "Raj_hashed_pw", expiry_date: "2023-11-28" },
  },
  {
    user_name: "Suraj",
    email: "suraj@example.com",
    secret: { password: "Suraj_hashed_pw", expiry_date: "2023-11-30" },
  },
  {
    user_name: "Emma",
    email: "emma@example.com",
    secret: { password: "Emma_hashed_pw", expiry_date: "2023-12-15" },
  },
  {
    user_name: "Ivan",
    email: "ivan@example.com",
    secret: { password: "Ivan_hashed_pw", expiry_date: "2023-12-6" },
  },
];
```

- Ref:
  - CRUD Instance: https://sequelize.org/docs/v6/core-concepts/model-instances/
  - Create with Association: https://sequelize.org/docs/v6/advanced-association-concepts/creating-with-associations/

```js
for (const user_data of users_data) {
  // ? https://sequelize.org/docs/v6/core-concepts/model-instances/
  const { user_name, email, secret: secret_data } = user_data;
  const user = await User.create({ user_name, email });
  await Secret.create({
    ...secret_data,
    user_id: user.user_id,
  });

  // ? https://sequelize.org/docs/v6/advanced-association-concepts/creating-with-associations/
  // ! Provided all elements are new
  // await Secret.create(
  //   {
  //     ...secret_data,
  //     user: { user_name, email },
  //   },
  //   { include: User }
  // );
}
```

OUTPUT

```bash
======================================Inserting USER & SECRET=======================================
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `user` (`user_id`,`user_name`,`email`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `secret` (`secret_id`,`password`,`expiry_date`,`user_id`) VALUES (DEFAULT,?,?,?);
```

## Select Query

```js
section("Fetch all Users");
console.log(JSON.stringify(await User.findAll(), null, 2));
```

OUTPUT

```bash
==========================================Fetch all Users===========================================
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user`;
[
  {
    "user_id": 1,
    "user_name": "Johnny",
    "email": "johnny@example.com",
    "createdAt": "2023-10-30T16:56:57.000Z",
    "updatedAt": "2023-10-30T16:56:57.000Z"
  },
  {
    "user_id": 2,
    "user_name": "Jane",
    "email": "jane@example.com",
    "createdAt": "2023-10-30T16:56:57.000Z",
    "updatedAt": "2023-10-30T16:56:57.000Z"
  },
  {
    "user_id": 3,
    "user_name": "Bravo",
    "email": "bravo@example.com",
    "createdAt": "2023-10-30T16:56:57.000Z",
    "updatedAt": "2023-10-30T16:56:57.000Z"
  },
  {
    "user_id": 4,
    "user_name": "Doe",
    "email": "doe@example.com",
    "createdAt": "2023-10-30T16:56:57.000Z",
    "updatedAt": "2023-10-30T16:56:57.000Z"
  },
  {
    "user_id": 5,
    "user_name": "Mary",
    "email": "mary@example.com",
    "createdAt": "2023-10-30T16:56:57.000Z",
    "updatedAt": "2023-10-30T16:56:57.000Z"
  },
  {
    "user_id": 6,
    "user_name": "Lisa",
    "email": "lisa@example.com",
    "createdAt": "2023-10-30T16:56:58.000Z",
    "updatedAt": "2023-10-30T16:56:58.000Z"
  },
  {
    "user_id": 7,
    "user_name": "Raj",
    "email": "raj@example.com",
    "createdAt": "2023-10-30T16:56:58.000Z",
    "updatedAt": "2023-10-30T16:56:58.000Z"
  },
  {
    "user_id": 8,
    "user_name": "Suraj",
    "email": "suraj@example.com",
    "createdAt": "2023-10-30T16:56:58.000Z",
    "updatedAt": "2023-10-30T16:56:58.000Z"
  },
  {
    "user_id": 9,
    "user_name": "Emma",
    "email": "emma@example.com",
    "createdAt": "2023-10-30T16:56:58.000Z",
    "updatedAt": "2023-10-30T16:56:58.000Z"
  },
  {
    "user_id": 10,
    "user_name": "Ivan",
    "email": "ivan@example.com",
    "createdAt": "2023-10-30T16:56:58.000Z",
    "updatedAt": "2023-10-30T16:56:58.000Z"
  }
]
```

## Join Queries

- Ref:
  - https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations

```js
// ?  https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations
section("Eager Association: Fetch Secret based on expiry_date");
const secretRes = await Secret.findAll({
  where: { expiry_date: { [Op.lt]: "2023-11-01" } }, // Operator mentioned below
  attributes: ["secret_id", "expiry_date", "user_id"],
  include: User, // Eager Loading
});
secretRes.forEach((secret) => {
  console.log(secret.toJSON());
});
```

OUTPUT

```bash
========================Eager Association: Fetch Secret based on expiry_date========================
Executing (default): SELECT `secret`.`secret_id`, `secret`.`expiry_date`, `secret`.`user_id`, `user`.`user_id` AS `user.user_id`, `user`.`user_name` AS `user.user_name`, `user`.`email` AS `user.email`, `user`.`createdAt` AS `user.createdAt`, `user`.`updatedAt` AS `user.updatedAt` FROM `secret` AS `secret` LEFT OUTER JOIN `user` AS `user` ON `secret`.`user_id` = `user`.`user_id` WHERE `secret`.`expiry_date` < '2023-10-31 18:30:00';
{
  secret_id: 1,
  expiry_date: 2023-10-10T00:00:00.000Z,
  user_id: 1,
  user: {
    user_id: 1,
    user_name: 'Johnny',
    email: 'johnny@example.com',
    createdAt: 2023-10-30T16:56:57.000Z,
    updatedAt: 2023-10-30T16:56:57.000Z
  }
}
{
  secret_id: 2,
  expiry_date: 2023-10-15T00:00:00.000Z,
  user_id: 2,
  user: {
    user_id: 2,
    user_name: 'Jane',
    email: 'jane@example.com',
    createdAt: 2023-10-30T16:56:57.000Z,
    updatedAt: 2023-10-30T16:56:57.000Z
  }
}
{
  secret_id: 3,
  expiry_date: 2023-10-11T00:00:00.000Z,
  user_id: 3,
  user: {
    user_id: 3,
    user_name: 'Bravo',
    email: 'bravo@example.com',
    createdAt: 2023-10-30T16:56:57.000Z,
    updatedAt: 2023-10-30T16:56:57.000Z
  }
}
```

## Table: Role & Permission

```js
section("Inserting PERMISSION");
const permissions_data = [
  {
    permission_name: "MyContent",
    description: "Create, edit and delete own contents",
  },
  { permission_name: "Create", description: "Create content" },
  { permission_name: "Publish", description: "Publish content" },
  { permission_name: "Edit", description: "Edit Content" },
  { permission_name: "Delete", description: "Delete Content" },
  { permission_name: "View", description: "View Content" },
  {
    permission_name: "MyComment",
    description: "Add, edit and delete own comments",
  },
  {
    permission_name: "Moderate Comment",
    description: "Edit or delete other's comments",
  },
  {
    permission_name: "Manage User",
    description: "Add or remove users",
  },
  {
    permission_name: "Manage Role",
    description: "Add, edit and remove roles",
  },
  {
    permission_name: "Analytics",
    description: "Access to analysis",
  },
];
await Permission.bulkCreate(permissions_data);
```

OUTPUT

```bash
========================================Inserting PERMISSION========================================
Executing (default): INSERT INTO `permission` (`permission_id`,`permission_name`,`description`) VALUES (NULL,'MyContent','Create, edit and delete own contents'),(NULL,'Create','Create content'),(NULL,'Publish','Publish content'),(NULL,'Edit','Edit Content'),(NULL,'Delete','Delete Content'),(NULL,'View','View Content'),(NULL,'MyComment','Add, edit and delete own comments'),(NULL,'Moderate Comment','Edit or delete other\'s comments'),(NULL,'Manage User','Add or remove users'),(NULL,'Manage Role','Add, edit and remove roles'),(NULL,'Analytics','Access to analysis');
```

```js
section("Inserting ROLE");
const roles_data = [
  {
    role_name: "Administrator",
    description: "Root role with all permissions",
  },
  {
    role_name: "Editor",
    description: "Publish, edit, view, comment and moderate comments",
  },
  {
    role_name: "Author",
    description: "Create articles, view and comment",
  },
  {
    role_name: "Contributor",
    description: "Contribute articles for other author, view and comment",
  },
  { role_name: "Viewer", description: "Able to view and comment" },
];
await Role.bulkCreate(roles_data);
```

OUTPUT

```bash
===========================================Inserting ROLE============================================
Executing (default): INSERT INTO `role` (`role_id`,`role_name`,`description`) VALUES (NULL,'Administrator','Root role with all permissions'),(NULL,'Editor','Publish, edit, view, comment and moderate comments'),(NULL,'Author','Create articles, view and comment'),(NULL,'Contributor','Contribute articles for other author, view and comment'),(NULL,'Viewer','Able to view and comment');
```

```js
section("Associating Role & Permission");
const rolePermissionMapping = {
  Administrator: [
    "MyContent",
    "Create",
    "Publish",
    "Edit",
    "Delete",
    "View",
    "MyComment",
    "Moderate Comment",
    "Manage User",
    "Manage Role",
    "Analytics",
  ],
  Editor: ["Publish", "Edit", "View", "MyComment", "Moderate Comment"],
  Author: ["MyContent", "View", "MyComment"],
  Contributor: ["Create", "View", "MyComment"],
  Viewer: ["View", "MyComment"],
};
```

## Adding Association

- Ref:
  - Operators: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
  - Special Associations Methods: https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances

```js
// ? https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
for (let [role, permission] of Object.entries(rolePermissionMapping)) {
  const roleObj = await Role.findOne({ where: { role_name: role } });
  const permissionObj = await Permission.findAll({
    where: { permission_name: { [Op.in]: permission } },
  });
  // ? https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  await roleObj.addPermissions(permissionObj);
}
```

OUTPUT

```bash
===================================Associating Role & Permission====================================
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_name` = 'Administrator';
Executing (default): SELECT `permission_id`, `permission_name`, `description` FROM `permission` AS `permission` WHERE `permission`.`permission_name` IN ('MyContent', 'Create', 'Publish', 'Edit', 'Delete', 'View', 'MyComment', 'Moderate Comment', 'Manage User', 'Manage Role', 'Analytics');
Executing (default): SELECT `role_id`, `permission_id` FROM `role_permission` AS `role_permission` WHERE `role_permission`.`role_id` = 1 AND `role_permission`.`permission_id` IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
Executing (default): INSERT INTO `role_permission` (`role_id`,`permission_id`) VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_name` = 'Editor';
Executing (default): SELECT `permission_id`, `permission_name`, `description` FROM `permission` AS `permission` WHERE `permission`.`permission_name` IN ('Publish', 'Edit', 'View', 'MyComment', 'Moderate Comment');
Executing (default): SELECT `role_id`, `permission_id` FROM `role_permission` AS `role_permission` WHERE `role_permission`.`role_id` = 2 AND `role_permission`.`permission_id` IN (4, 8, 7, 3, 6);
Executing (default): INSERT INTO `role_permission` (`role_id`,`permission_id`) VALUES (2,4),(2,8),(2,7),(2,3),(2,6);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_name` = 'Author';
Executing (default): SELECT `permission_id`, `permission_name`, `description` FROM `permission` AS `permission` WHERE `permission`.`permission_name` IN ('MyContent', 'View', 'MyComment');
Executing (default): SELECT `role_id`, `permission_id` FROM `role_permission` AS `role_permission` WHERE `role_permission`.`role_id` = 3 AND `role_permission`.`permission_id` IN (7, 1, 6);
Executing (default): INSERT INTO `role_permission` (`role_id`,`permission_id`) VALUES (3,7),(3,1),(3,6);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_name` = 'Contributor';
Executing (default): SELECT `permission_id`, `permission_name`, `description` FROM `permission` AS `permission` WHERE `permission`.`permission_name` IN ('Create', 'View', 'MyComment');
Executing (default): SELECT `role_id`, `permission_id` FROM `role_permission` AS `role_permission` WHERE `role_permission`.`role_id` = 4 AND `role_permission`.`permission_id` IN (2, 7, 6);
Executing (default): INSERT INTO `role_permission` (`role_id`,`permission_id`) VALUES (4,2),(4,7),(4,6);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_name` = 'Viewer';
Executing (default): SELECT `permission_id`, `permission_name`, `description` FROM `permission` AS `permission` WHERE `permission`.`permission_name` IN ('View', 'MyComment');
Executing (default): SELECT `role_id`, `permission_id` FROM `role_permission` AS `role_permission` WHERE `role_permission`.`role_id` = 5 AND `role_permission`.`permission_id` IN (7, 6);
Executing (default): INSERT INTO `role_permission` (`role_id`,`permission_id`) VALUES (5,7),(5,6);
```

## Lazy Fetching

- Ref:
  - Junction Table Fetching: https://sequelize.org/docs/v6/core-concepts/assocs/#foobelongstomanybar--through-baz-

```js
section("Lazy Role Permission Association Fetching");
let rolePermissions = await Role.findAll();
for (const rolePermission of rolePermissions) {
  console.log(rolePermission.toJSON());
  console.log(
    JSON.stringify(
      // ? https://sequelize.org/docs/v6/core-concepts/assocs/#foobelongstomanybar--through-baz-
      await rolePermission.getPermissions({ joinTableAttributes: [] }), // joinTableAttributes: [] Don't return Junction Table Data
      null,
      2
    )
  );
}
```

OUTPUT

```bash
=============================Lazy Role Permission Association Fetching==============================
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role`;
{
  role_id: 1,
  role_name: 'Administrator',
  description: 'Root role with all permissions'
}
Executing (default): SELECT `permission`.`permission_id`, `permission`.`permission_name`, `permission`.`description` FROM `permission` AS `permission` INNER JOIN `role_permission` AS `role_permission` ON `permission`.`permission_id` = `role_permission`.`permission_id` AND `role_permission`.`role_id` = 1;
[
  {
    "permission_id": 1,
    "permission_name": "MyContent",
    "description": "Create, edit and delete own contents"
  },
  {
    "permission_id": 2,
    "permission_name": "Create",
    "description": "Create content"
  },
  {
    "permission_id": 3,
    "permission_name": "Publish",
    "description": "Publish content"
  },
  {
    "permission_id": 4,
    "permission_name": "Edit",
    "description": "Edit Content"
  },
  {
    "permission_id": 5,
    "permission_name": "Delete",
    "description": "Delete Content"
  },
  {
    "permission_id": 6,
    "permission_name": "View",
    "description": "View Content"
  },
  {
    "permission_id": 7,
    "permission_name": "MyComment",
    "description": "Add, edit and delete own comments"
  },
  {
    "permission_id": 8,
    "permission_name": "Moderate Comment",
    "description": "Edit or delete other's comments"
  },
  {
    "permission_id": 9,
    "permission_name": "Manage User",
    "description": "Add or remove users"
  },
  {
    "permission_id": 10,
    "permission_name": "Manage Role",
    "description": "Add, edit and remove roles"
  },
  {
    "permission_id": 11,
    "permission_name": "Analytics",
    "description": "Access to analysis"
  }
]
{
  role_id: 2,
  role_name: 'Editor',
  description: 'Publish, edit, view, comment and moderate comments'
}
Executing (default): SELECT `permission`.`permission_id`, `permission`.`permission_name`, `permission`.`description` FROM `permission` AS `permission` INNER JOIN `role_permission` AS `role_permission` ON `permission`.`permission_id` = `role_permission`.`permission_id` AND `role_permission`.`role_id` = 2;
[
  {
    "permission_id": 3,
    "permission_name": "Publish",
    "description": "Publish content"
  },
  {
    "permission_id": 4,
    "permission_name": "Edit",
    "description": "Edit Content"
  },
  {
    "permission_id": 6,
    "permission_name": "View",
    "description": "View Content"
  },
  {
    "permission_id": 7,
    "permission_name": "MyComment",
    "description": "Add, edit and delete own comments"
  },
  {
    "permission_id": 8,
    "permission_name": "Moderate Comment",
    "description": "Edit or delete other's comments"
  }
]
{
  role_id: 3,
  role_name: 'Author',
  description: 'Create articles, view and comment'
}
Executing (default): SELECT `permission`.`permission_id`, `permission`.`permission_name`, `permission`.`description` FROM `permission` AS `permission` INNER JOIN `role_permission` AS `role_permission` ON `permission`.`permission_id` = `role_permission`.`permission_id` AND `role_permission`.`role_id` = 3;
[
  {
    "permission_id": 1,
    "permission_name": "MyContent",
    "description": "Create, edit and delete own contents"
  },
  {
    "permission_id": 6,
    "permission_name": "View",
    "description": "View Content"
  },
  {
    "permission_id": 7,
    "permission_name": "MyComment",
    "description": "Add, edit and delete own comments"
  }
]
{
  role_id: 4,
  role_name: 'Contributor',
  description: 'Contribute articles for other author, view and comment'
}
Executing (default): SELECT `permission`.`permission_id`, `permission`.`permission_name`, `permission`.`description` FROM `permission` AS `permission` INNER JOIN `role_permission` AS `role_permission` ON `permission`.`permission_id` = `role_permission`.`permission_id` AND `role_permission`.`role_id` = 4;
[
  {
    "permission_id": 2,
    "permission_name": "Create",
    "description": "Create content"
  },
  {
    "permission_id": 6,
    "permission_name": "View",
    "description": "View Content"
  },
  {
    "permission_id": 7,
    "permission_name": "MyComment",
    "description": "Add, edit and delete own comments"
  }
]
{
  role_id: 5,
  role_name: 'Viewer',
  description: 'Able to view and comment'
}
Executing (default): SELECT `permission`.`permission_id`, `permission`.`permission_name`, `permission`.`description` FROM `permission` AS `permission` INNER JOIN `role_permission` AS `role_permission` ON `permission`.`permission_id` = `role_permission`.`permission_id` AND `role_permission`.`role_id` = 5;
[
  {
    "permission_id": 6,
    "permission_name": "View",
    "description": "View Content"
  },
  {
    "permission_id": 7,
    "permission_name": "MyComment",
    "description": "Add, edit and delete own comments"
  }
]
```

## Table: User & Role

```js
section("Inserting in Role");
const roleUserMappings = {
  1: [1],
  2: [2, 10],
  3: [4, 5, 7],
  4: [6, 8],
  5: [3, 9],
};
// It should be User and Role mapping but it's for blog so lazy :p
for (let [role, user] of Object.entries(roleUserMappings)) {
  const roleObj = await Role.findByPk(role);
  const userObj = await User.findAll({
    where: { user_id: user }, // shorthand Op.in
  });
  await roleObj.addUser(userObj);
}
```

OUTPUT

```bash
=========================================Inserting in Role==========================================
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_id` = '1';
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user` WHERE `user`.`user_id` IN (1);
Executing (default): SELECT `user_id`, `role_id` FROM `user_role` AS `user_role` WHERE `user_role`.`role_id` = 1 AND `user_role`.`user_id` IN (1);
Executing (default): INSERT INTO `user_role` (`user_id`,`role_id`) VALUES (1,1);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_id` = '2';
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user` WHERE `user`.`user_id` IN (2, 10);
Executing (default): SELECT `user_id`, `role_id` FROM `user_role` AS `user_role` WHERE `user_role`.`role_id` = 2 AND `user_role`.`user_id` IN (2, 10);
Executing (default): INSERT INTO `user_role` (`user_id`,`role_id`) VALUES (2,2),(10,2);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_id` = '3';
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user` WHERE `user`.`user_id` IN (4, 5, 7);
Executing (default): SELECT `user_id`, `role_id` FROM `user_role` AS `user_role` WHERE `user_role`.`role_id` = 3 AND `user_role`.`user_id` IN (4, 5, 7);
Executing (default): INSERT INTO `user_role` (`user_id`,`role_id`) VALUES (4,3),(5,3),(7,3);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_id` = '4';
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user` WHERE `user`.`user_id` IN (6, 8);
Executing (default): SELECT `user_id`, `role_id` FROM `user_role` AS `user_role` WHERE `user_role`.`role_id` = 4 AND `user_role`.`user_id` IN (6, 8);
Executing (default): INSERT INTO `user_role` (`user_id`,`role_id`) VALUES (6,4),(8,4);
Executing (default): SELECT `role_id`, `role_name`, `description` FROM `role` AS `role` WHERE `role`.`role_id` = '5';
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user` WHERE `user`.`user_id` IN (3, 9);
Executing (default): SELECT `user_id`, `role_id` FROM `user_role` AS `user_role` WHERE `user_role`.`role_id` = 5 AND `user_role`.`user_id` IN (3, 9);
Executing (default): INSERT INTO `user_role` (`user_id`,`role_id`) VALUES (3,5),(9,5);
```

### Eager Fetching

```js
section("Eager Role & User Association Fetching");
const roleUser = await Role.findAll({
  include: {
    model: User,
    attributes: ["user_id", "user_name", "email"],
    through: { attributes: [] }, // Don't return Junction Table Data
  },
});
console.log(JSON.stringify(roleUser, null, 2));
```

OUTPUT

```bash
===============================Eager Role & User Association Fetching===============================
Executing (default): SELECT `role`.`role_id`, `role`.`role_name`, `role`.`description`, `users`.`user_id` AS `users.user_id`, `users`.`user_name` AS `users.user_name`, `users`.`email` AS `users.email` FROM `role` AS `role` LEFT OUTER JOIN ( `user_role` AS `users->user_role` INNER JOIN `user` AS `users` ON `users`.`user_id` = `users->user_role`.`user_id`) ON `role`.`role_id` = `users->user_role`.`role_id`;
[
  {
    "role_id": 1,
    "role_name": "Administrator",
    "description": "Root role with all permissions",
    "users": [
      {
        "user_id": 1,
        "user_name": "Johnny",
        "email": "johnny@example.com"
      }
    ]
  },
  {
    "role_id": 2,
    "role_name": "Editor",
    "description": "Publish, edit, view, comment and moderate comments",
    "users": [
      {
        "user_id": 2,
        "user_name": "Jane",
        "email": "jane@example.com"
      },
      {
        "user_id": 10,
        "user_name": "Ivan",
        "email": "ivan@example.com"
      }
    ]
  },
  {
    "role_id": 3,
    "role_name": "Author",
    "description": "Create articles, view and comment",
    "users": [
      {
        "user_id": 4,
        "user_name": "Doe",
        "email": "doe@example.com"
      },
      {
        "user_id": 5,
        "user_name": "Mary",
        "email": "mary@example.com"
      },
      {
        "user_id": 7,
        "user_name": "Raj",
        "email": "raj@example.com"
      }
    ]
  },
  {
    "role_id": 4,
    "role_name": "Contributor",
    "description": "Contribute articles for other author, view and comment",
    "users": [
      {
        "user_id": 6,
        "user_name": "Lisa",
        "email": "lisa@example.com"
      },
      {
        "user_id": 8,
        "user_name": "Suraj",
        "email": "suraj@example.com"
      }
    ]
  },
  {
    "role_id": 5,
    "role_name": "Viewer",
    "description": "Able to view and comment",
    "users": [
      {
        "user_id": 3,
        "user_name": "Bravo",
        "email": "bravo@example.com"
      },
      {
        "user_id": 9,
        "user_name": "Emma",
        "email": "emma@example.com"
      }
    ]
  }
]
```

## Table: Content

```js
section("Inserting in Content");
const contentDetails = [
  {
    user_id: 4,
    title: "RDBMS Relation",
    content: "Relation between DBMS entities",
  },
  {
    user_id: 5,
    title: "Phoenix",
    content: "Rising from the ash.",
  },
  {
    user_id: 4,
    title: "Git",
    content: "Git is SCM(Source Control Management)",
  },
  {
    user_id: 5,
    contributor_id: 6,
    title: "Shell on Rabbit",
    content: "OS independent Shell customization",
  },
  {
    user_id: 7,
    contributor_id: 8,
    title: "NoSQL",
    content: "Concealed Schema DBMS",
  },
  {
    user_id: 5,
    contributor_id: 8,
    title: "Docker",
    content: "Developing, shipping and running containers",
  },
];
for (const contentDetail of contentDetails) {
  await Content.create(contentDetail);
}
```

OUTPUT

```bash
========================================Inserting in Content========================================
Executing (default): INSERT INTO `content` (`content_id`,`title`,`content`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `content` (`content_id`,`title`,`content`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `content` (`content_id`,`title`,`content`,`user_id`) VALUES (DEFAULT,?,?,?);
Executing (default): INSERT INTO `content` (`content_id`,`title`,`content`,`user_id`,`contributor_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `content` (`content_id`,`title`,`content`,`user_id`,`contributor_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `content` (`content_id`,`title`,`content`,`user_id`,`contributor_id`) VALUES (DEFAULT,?,?,?,?);
```

## Multiple Association Fetching

```js
section("Fetching Content, Author & Contributor");
const contentData = await Content.findAll({ include: [User, "Contributor"] });
console.log(JSON.stringify(contentData, null, 2));

// Lazy Loading
// const contentData = await Content.findAll({});
// for (const content of contentData) {
//   console.log(content.toJSON());
//   let User_data = await content.getUser();
//   console.log(JSON.stringify(User_data, null, 2));
//   let Contributor_data = await content.getContributor(); // defined Contributor as alias
//   console.log(JSON.stringify(Contributor_data, null, 2));
// }
```

OUTPUT

```bash
===============================Fetching Content, Author & Contributor===============================
Executing (default): SELECT `content`.`content_id`, `content`.`title`, `content`.`content`, `content`.`user_id`, `content`.`contributor_id`, `user`.`user_id` AS `user.user_id`, `user`.`user_name` AS `user.user_name`, `user`.`email` AS `user.email`, `user`.`createdAt` AS `user.createdAt`, `user`.`updatedAt` AS `user.updatedAt`, `Contributor`.`user_id` AS `Contributor.user_id`, `Contributor`.`user_name` AS `Contributor.user_name`, `Contributor`.`email` AS `Contributor.email`, `Contributor`.`createdAt` AS `Contributor.createdAt`, `Contributor`.`updatedAt` AS `Contributor.updatedAt` FROM `content` AS `content` LEFT OUTER JOIN `user` AS `user` ON `content`.`user_id` = `user`.`user_id` LEFT OUTER JOIN `user` AS `Contributor` ON `content`.`contributor_id` = `Contributor`.`user_id`;
[
  {
    "content_id": 1,
    "title": "RDBMS Relation",
    "content": "Relation between DBMS entities",
    "user_id": 4,
    "contributor_id": null,
    "user": {
      "user_id": 4,
      "user_name": "Doe",
      "email": "doe@example.com",
      "createdAt": "2023-10-30T16:56:57.000Z",
      "updatedAt": "2023-10-30T16:56:57.000Z"
    },
    "Contributor": null
  },
  {
    "content_id": 2,
    "title": "Phoenix",
    "content": "Rising from the ash.",
    "user_id": 5,
    "contributor_id": null,
    "user": {
      "user_id": 5,
      "user_name": "Mary",
      "email": "mary@example.com",
      "createdAt": "2023-10-30T16:56:57.000Z",
      "updatedAt": "2023-10-30T16:56:57.000Z"
    },
    "Contributor": null
  },
  {
    "content_id": 3,
    "title": "Git",
    "content": "Git is SCM(Source Control Management)",
    "user_id": 4,
    "contributor_id": null,
    "user": {
      "user_id": 4,
      "user_name": "Doe",
      "email": "doe@example.com",
      "createdAt": "2023-10-30T16:56:57.000Z",
      "updatedAt": "2023-10-30T16:56:57.000Z"
    },
    "Contributor": null
  },
  {
    "content_id": 4,
    "title": "Shell on Rabbit",
    "content": "OS independent Shell customization",
    "user_id": 5,
    "contributor_id": 6,
    "user": {
      "user_id": 5,
      "user_name": "Mary",
      "email": "mary@example.com",
      "createdAt": "2023-10-30T16:56:57.000Z",
      "updatedAt": "2023-10-30T16:56:57.000Z"
    },
    "Contributor": {
      "user_id": 6,
      "user_name": "Lisa",
      "email": "lisa@example.com",
      "createdAt": "2023-10-30T16:56:58.000Z",
      "updatedAt": "2023-10-30T16:56:58.000Z"
    }
  },
  {
    "content_id": 5,
    "title": "NoSQL",
    "content": "Concealed Schema DBMS",
    "user_id": 7,
    "contributor_id": 8,
    "user": {
      "user_id": 7,
      "user_name": "Raj",
      "email": "raj@example.com",
      "createdAt": "2023-10-30T16:56:58.000Z",
      "updatedAt": "2023-10-30T16:56:58.000Z"
    },
    "Contributor": {
      "user_id": 8,
      "user_name": "Suraj",
      "email": "suraj@example.com",
      "createdAt": "2023-10-30T16:56:58.000Z",
      "updatedAt": "2023-10-30T16:56:58.000Z"
    }
  },
  {
    "content_id": 6,
    "title": "Docker",
    "content": "Developing, shipping and running containers",
    "user_id": 5,
    "contributor_id": 8,
    "user": {
      "user_id": 5,
      "user_name": "Mary",
      "email": "mary@example.com",
      "createdAt": "2023-10-30T16:56:57.000Z",
      "updatedAt": "2023-10-30T16:56:57.000Z"
    },
    "Contributor": {
      "user_id": 8,
      "user_name": "Suraj",
      "email": "suraj@example.com",
      "createdAt": "2023-10-30T16:56:58.000Z",
      "updatedAt": "2023-10-30T16:56:58.000Z"
    }
  }
]
```

## Table: Comment

```js
section("Inserting in Comment");
const commentDetails = [
  {
    content_id: 1,
    user_id: 1,
    comment: "Nice Pick",
    date: "2023-10-03",
  },
  {
    content_id: 1,
    user_id: 4,
    comment: "Thank You",
    date: "2023-10-03",
  },
  {
    content_id: 3,
    user_id: 9,
    comment: "Git is surely essential",
    date: "2023-10-15",
  },
  {
    content_id: 6,
    user_id: 6,
    comment: "To the point contributed by Suraj",
    date: "2023-10-23",
  },
  {
    content_id: 6,
    user_id: 6,
    comment: "Wish to keep it small and concise",
    date: "2023-10-24",
  },
  {
    content_id: 2,
    user_id: 5,
    comment: "Like, share and follow for more",
    date: "2023-10-25",
  },
];

for (const commentDetail of commentDetails) {
  await Comment.create(commentDetail);
}
```

OUTPUT

```bash
========================================Inserting in Comment========================================
Executing (default): INSERT INTO `comment` (`comment_id`,`comment`,`date`,`content_id`,`user_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `comment` (`comment_id`,`comment`,`date`,`content_id`,`user_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `comment` (`comment_id`,`comment`,`date`,`content_id`,`user_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `comment` (`comment_id`,`comment`,`date`,`content_id`,`user_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `comment` (`comment_id`,`comment`,`date`,`content_id`,`user_id`) VALUES (DEFAULT,?,?,?,?);
Executing (default): INSERT INTO `comment` (`comment_id`,`comment`,`date`,`content_id`,`user_id`) VALUES (DEFAULT,?,?,?,?);
```

## Fetching and Order By based on Associated value

- Ref:
  - Ordering & Grouping: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping

```js
section("Fetching Comment and User with Order By");
// ? https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
const commentData = await Comment.findAll({
  include: { model: User, attributes: ["user_id", "user_name", "email"] },
  order: [[User, "user_name", "ASC"]], // Order result by user_name which is associated in User model
});
console.log(JSON.stringify(commentData, null, 2));
```

OUTPUT

```bash
==============================Fetching Comment and User with Order By===============================
Executing (default): SELECT `comment`.`comment_id`, `comment`.`comment`, `comment`.`date`, `comment`.`content_id`, `comment`.`user_id`, `user`.`user_id` AS `user.user_id`, `user`.`user_name` AS `user.user_name`, `user`.`email` AS `user.email` FROM `comment` AS `comment` LEFT OUTER JOIN `user` AS `user` ON `comment`.`user_id` = `user`.`user_id` ORDER BY `user`.`user_name` ASC;
[
  {
    "comment_id": 2,
    "comment": "Thank You",
    "date": "2023-10-03T00:00:00.000Z",
    "content_id": 1,
    "user_id": 4,
    "user": {
      "user_id": 4,
      "user_name": "Doe",
      "email": "doe@example.com"
    }
  },
  {
    "comment_id": 3,
    "comment": "Git is surely essential",
    "date": "2023-10-15T00:00:00.000Z",
    "content_id": 3,
    "user_id": 9,
    "user": {
      "user_id": 9,
      "user_name": "Emma",
      "email": "emma@example.com"
    }
  },
  {
    "comment_id": 1,
    "comment": "Nice Pick",
    "date": "2023-10-03T00:00:00.000Z",
    "content_id": 1,
    "user_id": 1,
    "user": {
      "user_id": 1,
      "user_name": "Johnny",
      "email": "johnny@example.com"
    }
  },
  {
    "comment_id": 4,
    "comment": "To the point contributed by Suraj",
    "date": "2023-10-23T00:00:00.000Z",
    "content_id": 6,
    "user_id": 6,
    "user": {
      "user_id": 6,
      "user_name": "Lisa",
      "email": "lisa@example.com"
    }
  },
  {
    "comment_id": 5,
    "comment": "Wish to keep it small and concise",
    "date": "2023-10-24T00:00:00.000Z",
    "content_id": 6,
    "user_id": 6,
    "user": {
      "user_id": 6,
      "user_name": "Lisa",
      "email": "lisa@example.com"
    }
  },
  {
    "comment_id": 6,
    "comment": "Like, share and follow for more",
    "date": "2023-10-25T00:00:00.000Z",
    "content_id": 2,
    "user_id": 5,
    "user": {
      "user_id": 5,
      "user_name": "Mary",
      "email": "mary@example.com"
    }
  }
]
```

## Listing User and their Contributed Article

```js
section("List User and their Contributed Article");
const userContribution = await User.findAll();
for (const userContri of userContribution) {
  console.log(userContri.toJSON());
  console.log(JSON.stringify(await userContri.getContributed(), null, 2));
}
```

OUTPUT

```bash
==============================List User and their Contributed Article===============================
Executing (default): SELECT `user_id`, `user_name`, `email`, `createdAt`, `updatedAt` FROM `user` AS `user`;
{
  user_id: 1,
  user_name: 'Johnny',
  email: 'johnny@example.com',
  createdAt: 2023-10-30T16:56:57.000Z,
  updatedAt: 2023-10-30T16:56:57.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 1;
[]
{
  user_id: 2,
  user_name: 'Jane',
  email: 'jane@example.com',
  createdAt: 2023-10-30T16:56:57.000Z,
  updatedAt: 2023-10-30T16:56:57.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 2;
[]
{
  user_id: 3,
  user_name: 'Bravo',
  email: 'bravo@example.com',
  createdAt: 2023-10-30T16:56:57.000Z,
  updatedAt: 2023-10-30T16:56:57.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 3;
[]
{
  user_id: 4,
  user_name: 'Doe',
  email: 'doe@example.com',
  createdAt: 2023-10-30T16:56:57.000Z,
  updatedAt: 2023-10-30T16:56:57.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 4;
[]
{
  user_id: 5,
  user_name: 'Mary',
  email: 'mary@example.com',
  createdAt: 2023-10-30T16:56:57.000Z,
  updatedAt: 2023-10-30T16:56:57.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 5;
[]
{
  user_id: 6,
  user_name: 'Lisa',
  email: 'lisa@example.com',
  createdAt: 2023-10-30T16:56:58.000Z,
  updatedAt: 2023-10-30T16:56:58.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 6;
[
  {
    "content_id": 4,
    "title": "Shell on Rabbit",
    "content": "OS independent Shell customization",
    "user_id": 5,
    "contributor_id": 6
  }
]
{
  user_id: 7,
  user_name: 'Raj',
  email: 'raj@example.com',
  createdAt: 2023-10-30T16:56:58.000Z,
  updatedAt: 2023-10-30T16:56:58.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 7;
[]
{
  user_id: 8,
  user_name: 'Suraj',
  email: 'suraj@example.com',
  createdAt: 2023-10-30T16:56:58.000Z,
  updatedAt: 2023-10-30T16:56:58.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 8;
[
  {
    "content_id": 5,
    "title": "NoSQL",
    "content": "Concealed Schema DBMS",
    "user_id": 7,
    "contributor_id": 8
  },
  {
    "content_id": 6,
    "title": "Docker",
    "content": "Developing, shipping and running containers",
    "user_id": 5,
    "contributor_id": 8
  }
]
{
  user_id: 9,
  user_name: 'Emma',
  email: 'emma@example.com',
  createdAt: 2023-10-30T16:56:58.000Z,
  updatedAt: 2023-10-30T16:56:58.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 9;
[]
{
  user_id: 10,
  user_name: 'Ivan',
  email: 'ivan@example.com',
  createdAt: 2023-10-30T16:56:58.000Z,
  updatedAt: 2023-10-30T16:56:58.000Z
}
Executing (default): SELECT `content_id`, `title`, `content`, `user_id`, `contributor_id` FROM `content` AS `content` WHERE `content`.`contributor_id` = 10;
[]
```
