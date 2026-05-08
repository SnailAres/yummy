# Database Collections (MVP)

Recommended collections for cloud database:

- `users`
- `snacks`
- `snack_reviews`
- `snack_submissions`
- `favorites`
- `bean_logs`
- `rewards`
- `redemption_orders`
- `categories`
- `daily_rankings`
- `topic_feeds`
- `cps_click_logs`
- `audit_records`

Recommended indexes:

- `snacks.status + snacks.recommendIndex(desc)`
- `snacks.barcode`
- `snack_reviews.snackId + snack_reviews.status`
- `snack_submissions.status + snack_submissions.createdAt(desc)`
- `bean_logs.userId + bean_logs.createdAt(desc)`
