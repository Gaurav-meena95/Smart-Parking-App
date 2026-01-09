# Design Document: Database Migration from MongoDB to PostgreSQL with Prisma

## Overview

This design outlines the migration strategy from MongoDB/Mongoose to PostgreSQL/Prisma for the Smart Parking backend system. The migration will maintain API compatibility while improving type safety, performance, and data consistency through relational database features.

## Architecture

### Current Architecture
- **Database**: MongoDB with Mongoose ODM
- **Models**: Mongoose schemas for User and Vehicle
- **Connection**: Direct MongoDB connection via mongoose.connect()
- **Queries**: Mongoose query methods (findOne, create, etc.)

### Target Architecture
- **Database**: PostgreSQL with Prisma ORM
- **Models**: Prisma schema definitions with generated TypeScript types
- **Connection**: Prisma Client with connection pooling
- **Queries**: Type-safe Prisma Client methods

### Migration Strategy
1. **Schema-First Approach**: Define Prisma schema based on existing Mongoose models
2. **Incremental Replacement**: Replace Mongoose operations with Prisma equivalents
3. **API Compatibility**: Maintain existing REST API contracts
4. **Environment Transition**: Update configuration for PostgreSQL

## Components and Interfaces

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  vehicles  Vehicle[]
  
  @@map("users")
}

model Vehicle {
  id            String      @id @default(cuid())
  vehicleName   String
  vehicleNumber String      @unique
  ownerName     String
  ownerId       String?
  vehicleType   VehicleType @default(CAR)
  isActive      Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Relations
  owner         User?       @relation(fields: [ownerId], references: [id])
  
  @@map("vehicles")
}

enum Role {
  USER
  MANAGER
  DRIVER
  ADMIN
  
  @@map("user_roles")
}

enum VehicleType {
  CAR
  BIKE
  SUV
  
  @@map("vehicle_types")
}
```

### Database Connection Layer

```javascript
// Backend/DB/prisma.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('PostgreSQL connected successfully via Prisma')
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error.message)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  await prisma.$disconnect()
}

module.exports = { prisma, connectDB, disconnectDB }
```

### Model Interfaces

**User Operations Interface:**
```javascript
// Backend/Auth/db.js
const { prisma } = require('../DB/prisma')

class UserModel {
  static async create(userData) {
    return await prisma.user.create({
      data: userData
    })
  }
  
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }
  
  static async findByEmailAndRole(email, role) {
    return await prisma.user.findFirst({
      where: { 
        email,
        role: role.toUpperCase()
      }
    })
  }
}

module.exports = UserModel
```

**Vehicle Operations Interface:**
```javascript
// Backend/User/vehiclesMangament/db.js
const { prisma } = require('../../DB/prisma')

class VehicleModel {
  static async create(vehicleData) {
    return await prisma.vehicle.create({
      data: {
        ...vehicleData,
        vehicleType: vehicleData.vehicleType.toUpperCase()
      }
    })
  }
  
  static async findByNumber(vehicleNumber) {
    return await prisma.vehicle.findUnique({
      where: { vehicleNumber }
    })
  }
  
  static async findByOwner(ownerId) {
    return await prisma.vehicle.findMany({
      where: { ownerId },
      include: { owner: true }
    })
  }
}

module.exports = VehicleModel
```

## Data Models

### User Model Migration
**From Mongoose:**
- ObjectId → String (cuid)
- mongoose.Schema.Types.ObjectId → String with @relation
- enum values: lowercase → UPPERCASE
- timestamps: true → @default(now()) and @updatedAt

**Field Mappings:**
- `_id` → `id` (String, cuid)
- `name` → `name` (String)
- `email` → `email` (String, @unique)
- `password` → `password` (String)
- `role` → `role` (Role enum)
- `createdAt` → `createdAt` (@default(now()))
- `updatedAt` → `updatedAt` (@updatedAt)

### Vehicle Model Migration
**From Mongoose:**
- ObjectId references → String with @relation
- enum values: lowercase → UPPERCASE
- ref: 'User' → @relation(fields: [ownerId], references: [id])

**Field Mappings:**
- `_id` → `id` (String, cuid)
- `vehicleName` → `vehicleName` (String)
- `vehicleNumber` → `vehicleNumber` (String, @unique)
- `ownerName` → `ownerName` (String)
- `ownerId` → `ownerId` (String?, foreign key)
- `vehicleType` → `vehicleType` (VehicleType enum)
- `isActive` → `isActive` (Boolean, @default(true))
- `createdAt` → `createdAt` (@default(now()))
- `updatedAt` → `updatedAt` (@updatedAt)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing the prework analysis, I identified several areas where properties can be consolidated:

- Properties 3.1, 3.5, and 6.2 all relate to complete replacement of Mongoose with Prisma - these can be combined
- Properties 1.3 and 3.4 both address API compatibility - these can be combined  
- Properties 4.5 and error handling can be combined with connection testing
- Many "example" tests are specific configuration checks that don't need separate properties

### Database Migration Properties

**Property 1: Complete ORM Replacement**
*For any* database operation in the codebase, it should use Prisma Client methods and not contain any Mongoose imports or method calls
**Validates: Requirements 3.1, 3.5, 6.2**

**Property 2: API Response Compatibility**  
*For any* API endpoint that existed before migration, the response format and structure should remain identical after migration
**Validates: Requirements 1.3, 3.4**

**Property 3: Data Model Preservation**
*For any* data field or relationship that existed in the original Mongoose models, it should be preserved with equivalent functionality in the Prisma schema
**Validates: Requirements 1.4**

**Property 4: Database Connection Resilience**
*For any* database connection failure scenario, the system should handle the error gracefully and provide appropriate error messages
**Validates: Requirements 4.5**

## Error Handling

### Database Connection Errors
- **Connection Timeout**: Retry logic with exponential backoff
- **Invalid Credentials**: Clear error message without exposing sensitive information
- **Network Issues**: Graceful degradation with appropriate HTTP status codes

### Migration Errors
- **Schema Conflicts**: Detailed error reporting for schema validation failures
- **Data Type Mismatches**: Clear mapping between Mongoose and Prisma types
- **Constraint Violations**: Proper handling of unique constraints and foreign key violations

### Runtime Errors
- **Query Failures**: Proper error propagation with sanitized error messages
- **Transaction Rollbacks**: Automatic rollback on failed operations
- **Connection Pool Exhaustion**: Queue management and timeout handling

## Testing Strategy

### Unit Testing Approach
- **Model Operations**: Test individual CRUD operations for each model
- **Connection Logic**: Test database connection and disconnection scenarios
- **Error Scenarios**: Test various failure modes and error handling paths
- **Configuration**: Test environment variable loading and validation

### Property-Based Testing Configuration
- **Framework**: Use Jest with @fast-check/jest for property-based testing
- **Iterations**: Minimum 100 iterations per property test
- **Test Data Generation**: Generate realistic user and vehicle data for testing
- **Database State**: Use test database with proper setup/teardown

### Integration Testing
- **API Endpoints**: Test all existing endpoints maintain compatibility
- **Database Operations**: Test end-to-end database operations
- **Authentication Flow**: Test complete user authentication with new database layer
- **Vehicle Management**: Test complete vehicle CRUD operations

### Property Test Implementation
Each property test will be tagged with:
**Feature: database-migration, Property {number}: {property_text}**

Example property test structure:
```javascript
// Feature: database-migration, Property 1: Complete ORM Replacement
test('all database operations use Prisma Client', async () => {
  // Property-based test implementation
})
```

### Testing Database Migration
- **Schema Generation**: Verify Prisma schema generates correctly
- **Migration Files**: Test migration files apply without errors  
- **Data Integrity**: Verify data preservation during migration
- **Performance**: Compare query performance between old and new implementations