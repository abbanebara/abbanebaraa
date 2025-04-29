import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgSchema,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `bilgreen-2_${name}`);

export const authSchema = pgSchema("auth");
export const authTable = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const userEnum = pgEnum("user_enum", ["client", "seller"]);
export const planEnum = pgEnum("plan_enum", ["trial", "professional"]);

export const stateTable = createTable(
  "states",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    stateNameIndex: index("state_name_idx").on(self.name),
  }),
);

export const districtTable = createTable(
  "districts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),

    state_id: integer("state_id")
      .references(() => stateTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    districtNameIndex: index("district_name_idx").on(self.name),
  }),
);

export const communeTable = createTable(
  "communes",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),

    district_id: integer("district_id")
      .references(() => districtTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    communeNameIndex: index("commune_name_idx").on(self.name),
  }),
);

export const addressTable = createTable("addresses", {
  id: bigint("id", { mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),
  street: varchar("street", { length: 128 }),

  commune_id: integer("commune_id")
    .references(() => communeTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const specialityTable = createTable(
  "specialities",
  {
    id: bigint("id", { mode: "bigint" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar("name", { length: 128 }).unique().notNull(),
    approved: boolean("approved").default(false).notNull(),

    creator: userEnum("creator").notNull(),
    creatorId: uuid("creator_id").references(() => authTable.id, {
      onDelete: "set null",
      onUpdate: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    specialityNameIndex: index("speciality_name_idx").on(self.name),
  }),
);

export const userTable = createTable("users", {
  id: uuid("id")
    .references(() => authTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .primaryKey(),

  personalName: varchar("personal_name", { length: 128 }).notNull(),
  enterpriseName: varchar("enterprise_name", { length: 128 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 32 }).unique().notNull(),
  type: userEnum("type").array(),

  specialityId: bigint("speciality_id", { mode: "bigint" }).references(
    () => specialityTable.id,
    { onDelete: "set null", onUpdate: "set null" },
  ),

  addressId: bigint("address_id", { mode: "bigint" }).references(
    () => addressTable.id,
    {
      onDelete: "set null",
      onUpdate: "set null",
    },
  ),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const pricingTable = createTable(
  "pricing",
  {
    userId: uuid("user_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    plan: planEnum("plan").default("trial"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    primaryKey: primaryKey({ columns: [self.userId, self.plan] }),
  }),
);

export const categoryTable = createTable(
  "categories",
  {
    id: bigint("id", { mode: "bigint" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar("name", { length: 128 }).unique().notNull(),
    approved: boolean("approved").notNull().default(false),

    creator: userEnum("creator"),
    creatorId: uuid("creator_id").references(() => authTable.id, {
      onDelete: "set null",
      onUpdate: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    categoryNameIndex: index("category_name_idx").on(self.name),
  }),
);

export const subCategoryTable = createTable(
  "sub_category",
  {
    id: bigint("id", { mode: "bigint" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar("name", { length: 128 }).unique().notNull(),
    approved: boolean("approved").notNull().default(false),

    categoryId: bigint("category_id", { mode: "bigint" })
      .references(() => categoryTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    creator: userEnum("creator").notNull(),
    creatorId: uuid("creator_id").references(() => authTable.id, {
      onDelete: "set null",
      onUpdate: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    subNameIndex: index("sub_name_idx").on(self.name),
  }),
);

export const scrapTable = createTable(
  "scraps",
  {
    id: bigint("id", { mode: "bigint" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar("name", { length: 128 }).notNull(),
    description: varchar("description"),
    quantity: integer("quantity").notNull(),
    unit: text("unit").notNull(),
    price: integer("price").default(0).notNull(),
    isNegotiable: boolean("is_negotiable").default(false).notNull(),

    subCategoryId: bigint("sub_category_id", { mode: "bigint" }).references(
      () => subCategoryTable.id,
      {
        onDelete: "set null",
        onUpdate: "set null",
      },
    ),

    sellerId: uuid("seller_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    scrapNameIndex: index("scrap_name_idx").on(self.name),
  }),
);

export const orderTable = createTable("orders", {
  id: bigint("id", { mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),

  status: varchar("status", {
    enum: ["pending", "failed", "shipped", "cancelled"],
  })
    .default("pending")
    .notNull(),
  total_price: integer("total_price").notNull(),
  paymentStatus: varchar("payment_status", {
    enum: ["paid", "failed", "pending"],
  })
    .default("pending")
    .notNull(),
  paymentMethod: text("payment_method").notNull(),

  clientId: uuid("client_id")
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),

  scrapId: bigint("scrap_id", { mode: "bigint" })
    .references(() => scrapTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const favoriteTable = createTable(
  "favorites",
  {
    ownerId: uuid("owner_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    favoriteId: uuid("favorite_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
  },
  (self) => ({
    primaryKey: primaryKey({ columns: [self.ownerId, self.favoriteId] }),
  }),
);

export const requestTable = createTable("requests", {
  id: bigint("id", { mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),

  message: varchar("message").notNull(),
  description: varchar("description"),

  clientId: uuid("client_id")
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),

  sellerId: uuid("seller_id").references(() => userTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),

  scrapId: bigint("scrap_id", { mode: "bigint" }).references(
    () => scrapTable.id,
    { onDelete: "set null", onUpdate: "set null" },
  ),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const adminTable = createTable("admins", {
  id: uuid("id")
    .references(() => authTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .primaryKey(),

  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const roleTable = createTable("roles", {
  id: bigint("id", { mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 128 }).unique().notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const permissionTable = createTable("permissions", {
  id: bigint("id", { mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),
  permission: varchar("permission", { length: 128 }).unique().notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const rolePermissionTable = createTable(
  "role_permission",
  {
    roleId: bigint("role_id", { mode: "bigint" }),
    permissionId: bigint("permission_id", { mode: "bigint" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    primaryKey: primaryKey({ columns: [self.roleId, self.permissionId] }),
  }),
);

export const adminRoleTable = createTable(
  "admin_role",
  {
    adminId: uuid("admin_id").references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

    roleId: bigint("role_di", { mode: "bigint" }).references(
      () => roleTable.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    ),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (self) => ({
    primaryKey: primaryKey({ columns: [self.roleId, self.adminId] }),
  }),
);
