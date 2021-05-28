import createSchema from "./createSchema";
import updateSchema from "./updateSchema";

const validationSchema = { create: createSchema, update: updateSchema };

export default validationSchema;
