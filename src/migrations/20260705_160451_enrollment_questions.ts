import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enrollments_prior_lessons" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_enrollments_played_guitar_before" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_enrollments_owns_instrument" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_enrollments_owned_instrument" AS ENUM('guitar', 'ukulele', 'bass', 'other');
  ALTER TABLE "enrollments" ADD COLUMN "prior_lessons" "enum_enrollments_prior_lessons";
  ALTER TABLE "enrollments" ADD COLUMN "played_guitar_before" "enum_enrollments_played_guitar_before";
  ALTER TABLE "enrollments" ADD COLUMN "owns_instrument" "enum_enrollments_owns_instrument";
  ALTER TABLE "enrollments" ADD COLUMN "owned_instrument" "enum_enrollments_owned_instrument";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enrollments" DROP COLUMN "prior_lessons";
  ALTER TABLE "enrollments" DROP COLUMN "played_guitar_before";
  ALTER TABLE "enrollments" DROP COLUMN "owns_instrument";
  ALTER TABLE "enrollments" DROP COLUMN "owned_instrument";
  DROP TYPE "public"."enum_enrollments_prior_lessons";
  DROP TYPE "public"."enum_enrollments_played_guitar_before";
  DROP TYPE "public"."enum_enrollments_owns_instrument";
  DROP TYPE "public"."enum_enrollments_owned_instrument";`)
}
