import { relations } from 'drizzle-orm';
import {
    AnyPgColumn,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
  } from 'drizzle-orm/pg-core';
  
  const userRole = pgEnum('user-role', ['REGULAR','ADMIN',]);

  const filesystemType = pgEnum('filesystem-type', ['FILE', 'FOLDER'])
  
  export const user = pgTable(
    'user',
    {
      username: text('username').primaryKey(),
      role: userRole('userRole').notNull().default('REGULAR'),
      email: text('email').notNull().unique(),
      firstName: text('firstName').notNull(),
      lastName: text('lastName'),
      profilePic: text('profilePic'),
      password: text('password').notNull(),
      createdAt: timestamp('createdAt').notNull().defaultNow(),
      lastModified: timestamp('lastModified').notNull().defaultNow(),
    },
    (table) => {
      return {
        emailUniqueIndx: uniqueIndex('user_email_unqiue_indx').on(
          table.email,
        ),
      };
    },
  );

  // TODO: - create root folder when user is created
  // TODO: - While uploading validate that parentId is of 'FOLDER' type
  export const filesystem = pgTable('filesystem', {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: text('ownerId').notNull().references(() => user.username, { onDelete: 'cascade' }),
    parentId: uuid('parentId').references((): AnyPgColumn => filesystem.id, { onDelete: 'cascade' }),
    name: text('name').default('root'),
    url: text('url'),
    type: filesystemType('type'),
    // size: integer('size'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    lastModified: timestamp('lastModified').notNull().defaultNow(),
  },
  (table) => {
    return {
        // For fetching files/folders of a parent directory effectively.
        parentIdIndx: index('parentIdIndx').on(table.parentId),
        // One folder cannot have same named folder or same named files.
        uniqueNameCompositeIndx: uniqueIndex('uniqueNameCompositeIndx').on(table.parentId, table.name, table.type),
        // Composite index on Name and OwnerId for searching
        nameSearchIndx: index('nameSearchIndx').on(table.name, table.ownerId),
    }
  })


  // Filesystem relations
  export const filesystemRelation = relations(filesystem, ({ many }) => ({
    children: many(filesystem),
  }));