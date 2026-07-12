# odoo_hackathon

[ USER SCREEN ]
  (React / Vite Frontend)
           |
           |  1. User clicks a button 
           |    (Example: "Allocate Laptop")
           V
======================================================
                 OUR BACKEND ENGINE 
             (Node.js + Express Server)
------------------------------------------------------

 [ 📍 ROUTES ] 
    |-- The Traffic Cop. 
    |-- It looks at the request and says: 
    |   "Send this to the Allocation section."
    |
    V
 [ 🛡️ CONTROLLERS ] 
    |-- The Waiter.
    |-- Checks the data to make sure nothing is missing.
    |-- "Did the user give us both an Employee ID and Asset ID?"
    |
    V
 [ ⚙️ SERVICES ] 
    |-- The Kitchen (Core Logic). 
    |-- Makes the big decisions:
    |   1. Checks if the laptop is actually available.
    |   2. Updates the chain of custody.
    |   3. Writes a permanent note in the Audit Log.
    |
    V
 [ 🗄️ PRISMA ORM ] 
    |-- The Translator. 
    |-- Safely turns our JavaScript commands into 
    |   database commands.

======================================================
           |
           |  2. Saves the data safely
           V
[ POSTGRESQL DATABASE ]
  (Stores Assets, Employees, and History)
