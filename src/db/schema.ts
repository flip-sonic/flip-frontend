import {
  timestamp,
  pgTable,
  text,
  integer,
  varchar,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

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
  twitterName: text("twitter_name")
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