import * as migration_20260705_143238_initial_schema from './20260705_143238_initial_schema';
import * as migration_20260705_160451_enrollment_questions from './20260705_160451_enrollment_questions';

export const migrations = [
  {
    up: migration_20260705_143238_initial_schema.up,
    down: migration_20260705_143238_initial_schema.down,
    name: '20260705_143238_initial_schema',
  },
  {
    up: migration_20260705_160451_enrollment_questions.up,
    down: migration_20260705_160451_enrollment_questions.down,
    name: '20260705_160451_enrollment_questions'
  },
];
