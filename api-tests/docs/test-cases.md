# API test cases

## Auth
1. Valid credentials → token
2. Wrong username → Bad credentials (200)
3. Wrong password → Bad credentials (200)
4. Empty body → Bad credentials (200)
5. Malformed JSON → 400

## CRUD
6. Create booking
7. Get by id
8. Filter list by lastname
9. Full update (PUT)
10. Partial update (PATCH)
11. Delete then GET 404

## Validation
12. Create response schema
13. Get booking schema
14. Id list schema
15. JSON content-type
16. Response under 5s
17. Values consistent after update

## Negative
18. GET missing id → 404
19. PUT missing id → 405
20. DELETE missing id → 405
21. PUT no token → 403
22. DELETE no token → 403
23. PUT bad token → 403
24. Missing fields → 500
25. Bad price type → null
26. Bad date → 0NaN-aN-aN
27. Malformed JSON → 400
28. Empty body → 500

## Workflow
29. Token → create → get → put → patch → delete → 404
