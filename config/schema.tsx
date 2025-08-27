import { integer, pgTable, varchar,text, json, serial} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer()
});


export const SessionChatTable = pgTable("SessionChatTable", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 300 }).notNull(),
  notes: text("notes"),
  conversion: json("conversion").$type<any>(),  
  report: json("report").$type<any>(),         
  createdBy: varchar("createdBy", { length: 200 }),
  createdOn: varchar("createdOn", { length: 200 }),
  selectedDoctor: json("selectedDoctor").$type<any>(),
});
