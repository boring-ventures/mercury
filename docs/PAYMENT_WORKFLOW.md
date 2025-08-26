# 🔄 Complete Payment Workflow System

## Overview

This document describes the complete payment workflow system that handles the entire process from when an importer uploads a payment proof to when the admin completes the payment to the provider.

## 🎯 Workflow Steps

### 1. **Importer Uploads Payment Proof**

- **Trigger**: Importer completes contract and uploads payment proof document
- **Action**:
  - Creates `Payment` record with status `PENDING`
  - Creates `Document` record for payment proof
  - Updates contract `additionalData` with payment info
  - Sends notification to admins: `PAYMENT_PROOF_UPLOADED`

### 2. **Admin Reviews Payment Proof**

- **Trigger**: Admin receives notification and reviews the document
- **Actions Available**:
  - **APPROVE**: Payment proof is valid
  - **REJECT**: Payment proof has issues
  - **MARK_PROVIDER_PAID**: Admin has paid the provider

### 3. **Payment Status Updates**

- **Status Flow**:

  ```
  PENDING → APPROVED → PROVIDER_PAID → FINALIZED
  ```

- **Contract Status Flow**:
  ```
  COMPLETED → PAYMENT_PENDING → PAYMENT_REVIEWED → PROVIDER_PAID → PAYMENT_COMPLETED
  ```

### 4. **Admin Actions & Notifications**

#### **APPROVE Payment**

- **Payment Status**: `PENDING` → `APPROVED`
- **Contract Status**: `PAYMENT_PENDING` → `PAYMENT_REVIEWED`
- **Notification**: `PAYMENT_APPROVED` to importer
- **Next Step**: Admin pays provider

#### **REJECT Payment**

- **Payment Status**: `PENDING` → `FAILED`
- **Contract Status**: `PAYMENT_PENDING` → `PAYMENT_PENDING`
- **Notification**: `PAYMENT_REJECTED` to importer
- **Next Step**: Importer uploads new proof

#### **MARK_PROVIDER_PAID**

- **Payment Status**: `APPROVED` → `PROVIDER_PAID`
- **Contract Status**: `PAYMENT_REVIEWED` → `PROVIDER_PAID`
- **Notification**: `PROVIDER_PAYMENT_COMPLETED` to importer
- **Final Step**: Contract workflow completed

## 📊 Database Schema Updates

### **New Payment Statuses**

```sql
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "PaymentStatus" ADD VALUE 'APPROVED';
ALTER TYPE "PaymentStatus" ADD VALUE 'PROVIDER_PAID';
ALTER TYPE "PaymentStatus" ADD VALUE 'FINALIZED';
```

### **New Contract Statuses**

```sql
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_PENDING';
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_REVIEWED';
ALTER TYPE "ContractStatus" ADD VALUE 'PROVIDER_PAID';
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_COMPLETED';
```

### **New Document Types**

```sql
ALTER TYPE "DocumentType" ADD VALUE 'COMPROBANTE_PAGO_PROVEEDOR';
```

## 🔔 Notification System

### **Notification Types**

1. **`PAYMENT_PROOF_UPLOADED`**: Admin notified when importer uploads proof
2. **`PAYMENT_APPROVED`**: Importer notified when payment is approved
3. **`PAYMENT_REJECTED`**: Importer notified when payment is rejected
4. **`PROVIDER_PAYMENT_COMPLETED`**: Importer notified when provider is paid

### **Notification Recipients**

- **Admins**: Receive payment proof upload notifications
- **Importers**: Receive payment status update notifications

## 🛠️ API Endpoints

### **Importer Endpoints**

- `POST /api/importador/contracts/upload-payment-proof`
  - Upload payment proof document
  - Create payment record
  - Update contract status

### **Admin Endpoints**

- `POST /api/admin/payments/[id]/review`
  - Review payment proof
  - Approve/reject payment
  - Mark provider as paid

## 📋 Implementation Status

### **✅ Completed**

- [x] Payment proof upload API
- [x] Payment record creation
- [x] Admin review API
- [x] Notification system
- [x] Status workflow logic
- [x] Audit logging

### **🔄 In Progress**

- [ ] Database migration for new statuses
- [ ] Admin UI for payment review
- [ ] Importer UI updates for payment status

### **📝 To Do**

- [ ] Provider payment proof upload (admin)
- [ ] Final contract completion
- [ ] Payment history tracking
- [ ] Reporting and analytics

## 🔐 Security & Validation

### **Access Control**

- **Importers**: Can only upload proofs for their own contracts
- **Admins**: Can only review payments (SUPERADMIN role required)

### **Data Validation**

- File type validation (PDF, images only)
- File size validation (5MB max)
- Payment amount validation
- Contract ownership validation

### **Audit Trail**

- All payment status changes logged
- Document uploads tracked
- Admin actions recorded with timestamps

## 🚀 Next Steps

1. **Run Database Migration**: Execute the new status enums
2. **Update Admin UI**: Create payment review interface
3. **Update Importer UI**: Show payment status and history
4. **Test Workflow**: End-to-end testing of complete flow
5. **Add Provider Payment**: Admin uploads provider payment proof

## 💡 Benefits

- **Complete Transparency**: Importers can track payment status
- **Workflow Automation**: Automatic notifications and status updates
- **Audit Compliance**: Complete audit trail of all actions
- **Process Efficiency**: Clear steps and status tracking
- **Error Handling**: Proper rejection and retry mechanisms
