# PaySphere-Server


### Key Features:
```
- User authentication .

- School registration and management.

- Payment request creation via gateway.

- Transaction tracking with live status updates.

- Webhook handling for final payment confirmation.

- Dashboard APIs for transaction insights.
```

### Schemas
#### 1. User Schema 
```
- Fields : name, email, password 

- Password hashing using bcrypt before saving.

- Each user can own schools and manage transactions.
```
#### 2. School Schema 
```
- Fields:name, email, gateway_id, user_id (ref User).

- Linked to trustees via user_id.

- Represents an institution that receives payments.
```
#### 3. Order Schema 
```
- Fields :school_id, trustee_id, student_info {id, name, email}, gateway_name.

- Represents a payment request initiated by trustee/parent.

- Linked with OrderStatus to track progress.
```
#### 4. OrderStatus Schema 
```
- Fields : collect_id (ref Order), collect_request_id, order_amount, transaction_amount, status [PENDING, SUCCESS, FAILED], payment_mode, bank_reference, payment_message, error_message, payment_time.

- Tracks payment lifecycle from creation to final success/failure.

```

### Controllers

#### 1.Authentication (Sign Up) POST
``` 
- Registers a new user

- Saves user details :name, email, hashed password

- Generates a JWT token containing id, email, name, role.

- Sets expiry for the token using .env configs.

- Returns { user, token } with success message.
```
#### 2.Login 
```
- Accepts email and password from frontend.

- Finds user in DB, returns error if not found.

- Compares entered password with hashed one using bcrypt.

- If valid, generates JWT token with user details.

- Returns { user, token } with success message.
```
#### 3.School Controller
```

- Uses req.user.id  to identify trustee/admin.

- Fetches all schools linked to that user.

- If no schools exist, returns a "Schools not found" error.

- Returns ,list of schools owned by logged-in trustee.
```
#### 4. Payment Controller
```

- Accepts schoolId, amount, name, email, id for payment creation.

- Signs payload using PG_SECRET and prepares callback URL.

- Calls payment gateway API (/create-collect-request).

- Creates a new Order and a PENDING OrderStatus in DB.

- Returns, { payment_url, collect_request_id, student_info }.
```
#### 5.Payment Status
```
- Accepts collect_request_id as URL param.

- Prepares signed payload and calls PG API (/collect-request/:id).

- Updates matching OrderStatus with transaction amount & status.

- Ensures DB always has latest transaction status.

- Returns : status, amount and other fields
```
#### 6.Webhook Controller
```
- Triggered by payment gateway after a transaction.

- Accepts 'order_info' from gateway in request body.

- Updates OrderStatus with details  status, transaction amount, bank reference, etc.

- Returns "Order updated successfully" if matched, or "Order not found" if invalid.

- Ensures backend DB stays in sync with actual payment gateway status.
```

#### 7.Get All transactions 
```
- Supports query params  page, limit, status, sort, order.

- Aggregates OrderStatus with Order to join student & school info.

- Filters results by trustee_id .

- Returns transaction list with details school, student, status, amounts.

- Used for trustee’s main dashboard to see all transactions.
```
#### 8.Get All transactions By SchoolId
```
- Accepts schoolId as param.

- Aggregates OrderStatus with Order but filters by school_id.

- Projects , student info, amounts, status, school, payment time.

- Allows trustees to view payments per school.

- Returns all transactions for that school.
```
#### 9.Get Transaction Status
```
- Accepts custom_order_id (order reference) as param.

- Finds related OrderStatus by collect_id.

- If not found  returns "transaction not found".

- If found ,returns only the current status.
```

### Routes

#### 1.User Routes (/api/users)
``` 
- POST /signup → Register new user.

- POST /login → Authenticate user.

- School Routes (/api/schools)
```


#### 2.Payment Routes (/api/payments)
```
- POST /create → Create new payment request.

- GET /status/:collect_request_id → Get & update payment status.
```
#### 3.Webhook Routes (/api/webhook)
```
- POST /payment → Gateway sends final transaction update.
```
#### 4.Transaction Routes (/api/transactions)
```
- GET / → Get all transactions for trustee (with filters).

- GET /school/:schoolId → Get transactions for specific school.

- GET /:custom_order_id/status → Get status of a transaction.
```
### Overall Flow

- User Authentication → Trustee signs up / logs in → gets JWT.


- Payment Creation → Trustee initiates payment → order saved → redirect to gateway.

- Webhook Processing → Gateway notifies server → updates OrderStatus.

- Transaction Insights → Trustee fetches transaction history & statuses via /api/transactions.
