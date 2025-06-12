# Schema Changes - Company-User Relationship Update

## Overview

Updated the relationship between `Company` and `Profile` models to support multiple users per company and superadmins without company association.

## Changes Made

### Before (1:1 Relationship)

```prisma
model Profile {
  // ... fields
  company Company? // Implicit reverse relation
}

model Company {
  // ... fields
  profileId String @unique
  profile   Profile @relation(fields: [profileId], references: [id])
}
```

### After (1:Many Relationship)

```prisma
model Profile {
  // ... fields
  companyId String? @map("company_id")
  company   Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
}

model Company {
  // ... fields
  users Profile[] // Multiple users can belong to one company
}
```

## Benefits

1. **Multiple Users per Company**: Companies can now have multiple employees, managers, or administrators
2. **Superadmin Flexibility**: Superadmins don't need to be associated with any specific company (`companyId` can be null)
3. **Better Scalability**: Supports organizational hierarchies and role-based access within companies
4. **Cleaner Architecture**: More intuitive relationship structure

## Migration Required

The schema change requires a database migration to:

- Add `company_id` column to `profiles` table
- Migrate existing data from the old relationship
- Remove old `user_id` column from `companies` table
- Update foreign key constraints

## API Updates

Updated the registration approval process in `/api/admin/registration-petitions/[id]/route.ts` to:

1. Create Profile first
2. Create Company second
3. Link Profile to Company via `companyId`

## Use Cases Enabled

- **Company Teams**: Multiple importers working for the same company
- **Role Hierarchy**: Different permission levels within the same company
- **Super Admins**: Platform administrators not tied to any specific company
- **Multi-tenant Support**: Better separation of company data and users

## Backward Compatibility

Existing data is preserved through the migration script. All current company-profile relationships are maintained in the new structure.
