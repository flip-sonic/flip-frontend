import {
  timestamp,
  pgTable,
  text,
  integer,
  varchar,
  serial,
  pgEnum,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// enum table
export const actionTypeEnum = pgEnum('action_type', ['like', 'retweet', 'follow', 'join']);

// user table
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  walletAddress: varchar('wallet_address', { length: 255 }).unique().notNull(),
  points: integer('points').default(0),
  twitterId: text("twitter_id").unique(),
  twitterName: text("twitter_name"),
  referralId: varchar("referral_Id", { length: 6 }).unique().notNull(),
})

// Actions table
export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actionType: actionTypeEnum("action_type").notNull(),
  tweetId: varchar('tweet_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Referral table
export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referredId: text('referred_id')
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp('created_at').defaultNow(),
},
(table) => ({
  uniqueReferral: unique().on(table.userId, table.referredId),
  userIndex: index('idx_user_id').on(table.userId),
  referredIndex: index('idx_referred_id').on(table.referredId)
}));


// claim point table
export const claimPoints = pgTable('claim_points', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  nextAt: timestamp('next_at').defaultNow().$defaultFn(() => sql`NOW() + INTERVAL '12 HOURS'`)
});
