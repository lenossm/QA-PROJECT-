import { Ajv, type Schema } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

/**
 * Validates a response body against a JSON schema and throws with the full
 * list of violations, so a schema failure reads like a proper test failure
 * instead of a generic boolean assertion.
 */
export function assertMatchesSchema(body: unknown, schema: Schema, label: string): void {
  const validate = ajv.compile(schema);
  if (!validate(body)) {
    const details = (validate.errors ?? [])
      .map((error) => `  ${error.instancePath || '(root)'} ${error.message ?? ''}`)
      .join('\n');
    throw new Error(`${label} does not match the expected JSON schema:\n${details}`);
  }
}
