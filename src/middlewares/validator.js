import { celebrate } from "celebrate";

export const validator = (schema) => {
    return celebrate(schema, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: { arrays: false, objects: true }
    });
}