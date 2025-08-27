-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid()::text = userId);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid()::text = userId);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid()::text = userId);

-- Companies table policies
-- Users can view companies they belong to
CREATE POLICY "Users can view own company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update companies they belong to
CREATE POLICY "Users can update own company" ON companies
    FOR UPDATE USING (
        id IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert companies (for registration)
CREATE POLICY "Users can insert companies" ON companies
    FOR INSERT WITH CHECK (true);

-- Contracts table policies
-- Users can view contracts related to their company
CREATE POLICY "Users can view company contracts" ON contracts
    FOR SELECT USING (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update contracts they created or are assigned to
CREATE POLICY "Users can update assigned contracts" ON contracts
    FOR UPDATE USING (
        "createdById" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
        OR "assignedToId" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert contracts for their company
CREATE POLICY "Users can insert company contracts" ON contracts
    FOR INSERT WITH CHECK (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Quotations table policies
-- Users can view quotations related to their company
CREATE POLICY "Users can view company quotations" ON quotations
    FOR SELECT USING (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update quotations they created or are assigned to
CREATE POLICY "Users can update assigned quotations" ON quotations
    FOR UPDATE USING (
        "createdById" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
        OR "assignedToId" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert quotations for their company
CREATE POLICY "Users can insert company quotations" ON quotations
    FOR INSERT WITH CHECK (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Requests table policies
-- Users can view requests related to their company
CREATE POLICY "Users can view company requests" ON requests
    FOR SELECT USING (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update requests they created or are assigned to
CREATE POLICY "Users can update assigned requests" ON requests
    FOR UPDATE USING (
        "createdById" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
        OR "assignedToId" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert requests for their company
CREATE POLICY "Users can insert company requests" ON requests
    FOR INSERT WITH CHECK (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Documents table policies
-- Users can view documents related to their company
CREATE POLICY "Users can view company documents" ON documents
    FOR SELECT USING (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update documents they uploaded
CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (
        "uploadedById" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert documents for their company
CREATE POLICY "Users can insert company documents" ON documents
    FOR INSERT WITH CHECK (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Notifications table policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        "userId" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (
        "userId" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert notifications for themselves
CREATE POLICY "Users can insert own notifications" ON notifications
    FOR INSERT WITH CHECK (
        "userId" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Providers table policies
-- Users can view providers related to their company
CREATE POLICY "Users can view company providers" ON providers
    FOR SELECT USING (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update providers they created
CREATE POLICY "Users can update own providers" ON providers
    FOR UPDATE USING (
        "createdById" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert providers for their company
CREATE POLICY "Users can insert company providers" ON providers
    FOR INSERT WITH CHECK (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Payments table policies
-- Users can view payments related to their company
CREATE POLICY "Users can view company payments" ON payments
    FOR SELECT USING (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update payments they created
CREATE POLICY "Users can update own payments" ON payments
    FOR UPDATE USING (
        "createdById" IN (
            SELECT id FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert payments for their company
CREATE POLICY "Users can insert company payments" ON payments
    FOR INSERT WITH CHECK (
        "companyId" IN (
            SELECT "companyId" FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Registration requests table policies
-- Users can view their own registration requests
CREATE POLICY "Users can view own registration requests" ON registration_requests
    FOR SELECT USING (
        "email" = (
            SELECT email FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can update their own registration requests
CREATE POLICY "Users can update own registration requests" ON registration_requests
    FOR UPDATE USING (
        "email" = (
            SELECT email FROM profiles 
            WHERE "userId" = auth.uid()::text
        )
    );

-- Users can insert registration requests
CREATE POLICY "Users can insert registration requests" ON registration_requests
    FOR INSERT WITH CHECK (true);

-- Admin override policies (for admin users)
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all companies
CREATE POLICY "Admins can view all companies" ON companies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all companies
CREATE POLICY "Admins can update all companies" ON companies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all contracts
CREATE POLICY "Admins can view all contracts" ON contracts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all contracts
CREATE POLICY "Admins can update all contracts" ON contracts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all quotations
CREATE POLICY "Admins can view all quotations" ON quotations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all quotations
CREATE POLICY "Admins can update all quotations" ON quotations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all requests
CREATE POLICY "Admins can update all requests" ON requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all documents
CREATE POLICY "Admins can view all documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all documents
CREATE POLICY "Admins can update all documents" ON documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications" ON notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all notifications
CREATE POLICY "Admins can update all notifications" ON notifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all providers
CREATE POLICY "Admins can view all providers" ON providers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all providers
CREATE POLICY "Admins can update all providers" ON providers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all payments
CREATE POLICY "Admins can update all payments" ON payments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can view all registration requests
CREATE POLICY "Admins can view all registration requests" ON registration_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Admins can update all registration requests
CREATE POLICY "Admins can update all registration requests" ON registration_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE "userId" = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );
