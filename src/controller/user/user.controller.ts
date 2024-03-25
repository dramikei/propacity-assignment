import { Boom } from "@hapi/boom";
import { CreateUser, CreateUserSchema } from "src/db/types";
import { Value } from '@sinclair/typebox/value';
import { handleRequestValidation } from "src/utils/requestValidation";


export async function getUserDetails(userId: String) {

}

export async function createUser(userData: CreateUser) {
    // Can be created as a middleware.
    handleRequestValidation(CreateUserSchema, userData);
    // const validatedData = CreateUserSchema.parse(userData);
    // const data = await db.insert(user).values(body).returning();
}