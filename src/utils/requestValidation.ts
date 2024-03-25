import { Boom } from '@hapi/boom';
import { Value } from '@sinclair/typebox/value';

export function handleRequestValidation(schema: any, data: any) {
    const validationErrors = [...Value.Errors(schema, data)];
    if(validationErrors.length) {
        throw new Boom(`${validationErrors?.[0].path} ${validationErrors?.[0].message}` ?? 'Invalid request data!', {
            statusCode: 400,
        });
    }
}