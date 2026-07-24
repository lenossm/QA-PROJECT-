# UI test cases

Quick list of what the automated suite covers.

## Login
1. Valid login → inventory
2. Wrong password → error
3. Empty username → error
4. Empty password → error
5. Both empty → username required first
6. Locked out user → locked message
7. Dismiss error, then login ok
8. Logout, inventory blocked

## Inventory
9. Shows 6 products
10. Each card has name, desc, price, add button
11. Backpack name + price
12-15. Sort A-Z, Z-A, low-high, high-low

## Product details
16. Open fleece → details match
17. Back to products
18. Add from details → appears in cart

## Cart
19. Add one → badge 1
20. Add three → badge 3
21. Remove from inventory
22. Remove from cart page
23. Name / price / qty correct
24. Empty cart, no badge
25. Continue shopping keeps badge

## Checkout
26. Happy path → thank you
27-29. Missing first / last / postal
30. Overview shows items + payment
31. Totals = items + 8% tax
32. Cancel keeps cart
33. Back home after order → empty cart

## E2E
34. Buy backpack + fleece, full path
