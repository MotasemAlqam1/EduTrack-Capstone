# Nour — Common Errors & Solutions

## Error 1

```bash
Cannot connect to server
```

**Solution:**  
Make sure JSON Server is running and the endpoint is correct, for example:

```text
http://localhost:3000/
```

**Notion Info / What I Learned:**  
Before debugging frontend code, confirm that the backend server is running and the URL is correct.

---

## Error 2

```bash
Email not found
```

**Solution:**  
Check whether the entered email exists in the `instructors` data before trying to log in.

**Notion Info / What I Learned:**  
Login validation should handle the case where no matching user is returned before checking the password.

---

## Error 3

```bash
Incorrect password
```

**Solution:**  
Compare the entered password with the password of the instructor returned from the server.

**Notion Info / What I Learned:**  
Authentication validation should be handled step by step: first verify the account exists, then verify the password.

---

## Error 4

```text
The instructor can see students from other instructors
```

**Solution:**  
Filter students using `instructorId` so every instructor can only see their own students.

**Notion Info / What I Learned:**  
Data isolation is important in multi-user systems. Each record should be connected to its owner and filtered accordingly.

---

## Error 5

```text
Profile data does not update after editing
```

**Solution:**  
Use a `PATCH` request to update the instructor data and then update `sessionStorage` with the new returned data.

**Notion Info / What I Learned:**  
When server data changes, local session data should also be refreshed so the UI immediately shows the latest information.

---

## Error 6

```text
Profile information disappears after logout
```

**Solution:**  
The permanent profile data should be stored in `db.json`. `sessionStorage` should only keep the currently logged-in instructor during the session.

**Notion Info / What I Learned:**  
`sessionStorage` is temporary and is not a replacement for database storage. Persistent profile data belongs in the database.

---

## Error 7

```text
There were many conflicts when we were trying to push and pull our work from GitHub
```

**Solution:**  
Pull the latest changes first, resolve conflicts manually, then run:

```bash
git add .
git commit -m "Resolve merge conflicts"
git push
```

**Notion Info / What I Learned:**  
In team projects, frequent pulls and careful conflict resolution help keep branches synchronized and reduce the risk of overwriting work.

---

## Error 8

```text
Dark theme colors were not consistent across the pages
```

**Solution:**  
Adjust the Dark Theme colors to make the interface more consistent and readable. The green palette was updated so the main sections, buttons, sidebar, and other components match the overall EduTrack design in dark mode.

**Notion Info / What I Learned:**  
Dark mode is not only about changing the background to a dark color. Text, buttons, borders, cards, and accent colors also need to be adjusted to keep good contrast and a consistent design.

