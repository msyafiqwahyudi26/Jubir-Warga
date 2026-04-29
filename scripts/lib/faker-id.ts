// Indonesian-locale faker setup, with deterministic seed for reproducibility.
// Override seed via FAKER_SEED env var if needed for debugging.
import { fakerID_ID, faker } from '@faker-js/faker';

const seed = process.env.FAKER_SEED ? Number.parseInt(process.env.FAKER_SEED, 10) : 20260429;
fakerID_ID.seed(seed);
faker.seed(seed);

export const f = fakerID_ID;
export { faker };
