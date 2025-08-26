# Row Level Security (RLS) Setup

This document explains how to set up Row Level Security policies in Supabase to fix the 403 Forbidden errors you're experiencing.

## Problem

You're getting a 403 Forbidden error when trying to access the `profiles` table:

```
GET https://hhineqbtekizcogikaef.supabase.co/rest/v1/profiles?select=id%2CcompanyId%2Crole&userId=eq.7d267ddd-bc66-4365-bce4-8de6a4ec949d 403 (Forbidden)
```

This happens because:

1. Row Level Security (RLS) is enabled on the `profiles` table
2. No policies are defined to allow users to read their own profile data
3. By default, RLS blocks all access when no policies exist

## Solution

Apply the RLS policies defined in `rls-policies.sql` to your Supabase database.

## How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `rls-policies.sql`
4. Paste and execute the SQL commands

### Option 2: Supabase CLI

1. Install Supabase CLI if you haven't already
2. Run the following command:
   ```bash
   supabase db push --db-url "your-database-url"
   ```

### Option 3: Direct Database Connection

1. Connect to your PostgreSQL database directly
2. Execute the SQL commands from `rls-policies.sql`

## What These Policies Do

### User Access

- **Profiles**: Users can only read/update their own profile
- **Companies**: Users can only access companies they belong to
- **Contracts**: Users can only see contracts related to their company
- **Quotations**: Users can only see quotations related to their company
- **Requests**: Users can only see requests related to their company
- **Documents**: Users can only see documents related to their company
- **Notifications**: Users can only see their own notifications
- **Providers**: Users can only see providers related to their company
- **Payments**: Users can only see payments related to their company

### Admin Access

- Admins (users with `role = 'ADMIN'`) can access all data across all tables
- This allows administrators to manage the system while maintaining security for regular users

## Verification

After applying the policies, test that:

1. Users can access their own profile data
2. Users can see contracts, quotations, and requests for their company
3. Admins can access all data
4. Users cannot access data from other companies

## Troubleshooting

### If policies don't work:

1. **Check RLS is enabled**: Ensure `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;` was executed
2. **Verify policies exist**: Check that policies were created without errors
3. **Check user authentication**: Ensure the user is properly authenticated
4. **Check user role**: Verify the user has the correct role assigned

### Common Issues:

1. **Policy syntax errors**: Check the SQL syntax in Supabase logs
2. **Missing policies**: Ensure all necessary policies were created
3. **Role mismatch**: Verify the user's role in the profiles table
4. **Company ID mismatch**: Ensure the user has a valid companyId

## Security Benefits

These RLS policies provide:

- **Data isolation**: Users can only access their company's data
- **Privacy protection**: Personal information is restricted to the owner
- **Multi-tenancy**: Multiple companies can use the same database safely
- **Admin oversight**: Administrators maintain full access for management

## Next Steps

After applying these policies:

1. Test the application to ensure all functionality works
2. Monitor for any new 403 errors
3. Adjust policies as needed for your specific use case
4. Consider adding additional policies for new tables as you expand the application
