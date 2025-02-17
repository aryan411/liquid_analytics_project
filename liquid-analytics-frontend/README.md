# Problem statement
In traditional spreadsheet applications, users need to install software locally and can't collaborate in real-time. We aim to create a web-based spreadsheet solution that allows users to perform basic calculations and data entry through their browser, with changes instantly syncing across all connected user via WebSocket technology and persisting in DuckDB.
# Approach

- User will see spreadsheet like interface in browser
- User can edit any cell and changes will be saved in database
- User can select multiple cells at once
- User can perform only two operations:
   - Addition of numbers
   - Multiplication of numbers


# Sequence Diagram

```mermaid
sequenceDiagram
    participant UI as React UI
    participant WS as WebSocket
    participant BE as Backend
    participant DB as DuckDB

    UI->>WS: Initialize WebSocket Connection
    WS->>BE: Establish Connection
    BE->>UI: Connection Confirmed
    
    Note over UI,BE: Initial Data Sync
    
    BE->>DB: Fetch Initial Data
    DB->>BE: Return Data
    BE->>WS: Send Initial Data
    WS->>UI: Display Data in Grid
    
    Note over UI,DB: User Updates
    
    UI->>WS: Edit Cell Data
    WS->>BE: Send Updates
    BE->>DB: Store Changes
    DB->>BE: Confirm Storage
    BE->>WS: Broadcast Updates
    WS->>UI: Update Grid Display
```