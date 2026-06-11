# Security Specification

## Data Invariants
1. Projects can only be created, updated, or deleted by an Admin.
2. Projects can be read by anyone (blanket read for projects is NOT OK without rule evaluation, but since this is a public portfolio, we allow read if true, wait -- no, we can do `allow read: if true;` for public-facing data like projects, but let's be careful). Actually, the project states might be public.
3. Admins collection can only be read/written by an Admin.
4. Admins are users listed in the `admins/{userId}` collection, OR the bootstrapped admin `deathrb12@gmail.com`.

## Dirty Dozen Payloads
- T1: Anyone read projects -> True
- T2: Anon write project -> False
- T3: Authenticated non-admin write project -> False
- T4: Admin write project missing fields -> False
- T5: Admin write project with valid data -> True
- T6: Admin write project with extra fields -> False
- T7: Anon read admins -> False
- T8: Auth non-admin read admins -> False
...
