// npm install mysql2 sequelize
// Code & Output in ./NodeJs_Sequelize.md

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

// ## Initialize Engine with dialect and DB engine
// ? Getting Started: https://sequelize.org/docs/v6/getting-started/
// ? API Reference: https://sequelize.org/api/v6/identifiers
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

// Option 2: Passing parameters separately
// const sequelize = new Sequelize(db_name, db_user, db_pass, {
//   host: db_host,
//   dialect: "mysql",
// });

// # Testing Connection
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

try {
  // # TABLE CREATION
  // ? Model Basic: https://sequelize.org/docs/v6/core-concepts/model-basics/
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

  // # Define associations/joins
  // ? https://sequelize.org/docs/v6/core-concepts/assocs
  // ? https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "role_id",
  });
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permission_id",
  });

  User.belongsToMany(Role, {
    through: "user_role",
    foreignKey: "user_id",
    onUpdate: "NO ACTION",
    onDelete: "CASCADE",
  });
  Role.belongsToMany(User, {
    through: "user_role",
    foreignKey: "role_id",
    onUpdate: "NO ACTION",
    onDelete: "CASCADE",
  });

  User.hasOne(Secret, {
    foreignKey: { name: "user_id", allowNull: false, unique: true },
    onUpdate: "NO ACTION",
    onDelete: "CASCADE",
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

  // ? Model Synchronization: https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  section("Start Synchronizing");
  await sequelize.sync({ force: true }); // ! DON'T DROP TABLES IN PRODUCTION
  section("All models were synchronized successfully.");

  // ## Table: User & Secret
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

  for (const user_data of users_data) {
    // ? CRUD Instance: https://sequelize.org/docs/v6/core-concepts/model-instances/
    const { user_name, email, secret: secret_data } = user_data;
    const user = await User.create({ user_name, email });
    await Secret.create({
      ...secret_data,
      user_id: user.user_id,
    });

    // ? Create with Association: https://sequelize.org/docs/v6/advanced-association-concepts/creating-with-associations/
    // ! Provided all elements are new
    // await Secret.create(
    //   {
    //     ...secret_data,
    //     user: { user_name, email },
    //   },
    //   { include: User }
    // );
  }

  section("Fetch all Users");
  console.log(JSON.stringify(await User.findAll(), null, 2));

  section("Eager Association: Fetch Secret based on expiry_date");
  // ? Join Queries: https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations
  const secretRes = await Secret.findAll({
    where: { expiry_date: { [Op.lt]: "2023-11-01" } }, // Operator mentioned below
    attributes: ["secret_id", "expiry_date", "user_id"],
    include: User, // Eager Loading
  });
  secretRes.forEach((secret) => {
    console.log(secret.toJSON());
  });

  // # Table: Role & Permission
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
  // ? Operators: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
  for (let [role, permission] of Object.entries(rolePermissionMapping)) {
    const roleObj = await Role.findOne({ where: { role_name: role } });
    const permissionObj = await Permission.findAll({
      where: { permission_name: { [Op.in]: permission } },
    });
    // ? Special Associations Methods: https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
    await roleObj.addPermissions(permissionObj);
  }

  section("Lazy Role Permission Association Fetching");
  let rolePermissions = await Role.findAll();
  for (const rolePermission of rolePermissions) {
    console.log(rolePermission.toJSON());
    console.log(
      JSON.stringify(
        // ? Junction Table: https://sequelize.org/docs/v6/core-concepts/assocs/#foobelongstomanybar--through-baz-
        await rolePermission.getPermissions({ joinTableAttributes: [] }), // joinTableAttributes: [] Don't return Junction Table Data
        null,
        2
      )
    );
  }

  // # Table: User & Role
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
  section("Eager Role & User Association Fetching");
  const roleUser = await Role.findAll({
    include: {
      model: User,
      attributes: ["user_id", "user_name", "email"],
      through: { attributes: [] }, // Don't return Junction Table Data
    },
  });
  console.log(JSON.stringify(roleUser, null, 2));

  // # Table: Content
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

  // # Table: Comment
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

  section("Fetching Comment and User with Order By");
  // ? https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
  const commentData = await Comment.findAll({
    include: { model: User, attributes: ["user_id", "user_name", "email"] },
    order: [[User, "user_name", "ASC"]], // Order result by user_name which is associated in User model
  });
  console.log(JSON.stringify(commentData, null, 2));

  // # Listing User and their Contributed Article
  section("List User and their Contributed Article");
  const userContribution = await User.findAll();
  for (const userContri of userContribution) {
    console.log(userContri.toJSON());
    console.log(JSON.stringify(await userContri.getContributed(), null, 2));
  }
} catch (error) {
  console.log(error);
} finally {
  sequelize.close();
}
