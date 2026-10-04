# Ahmad Kayali — Common Errors & Solutions

## Error 1 — JSON Server Execution Error

**Problem:**  
Running:

```bash
npx json-server db.json
```

caused PowerShell to block the `npx.ps1` script.

**Solution:**  
Use:

```bash
npx.cmd json-server db.json
```

This allows JSON Server to run correctly.

**Notion Info / What I Learned:**  
The issue was related to the PowerShell execution policy, not JSON Server itself. Using `npx.cmd` is a practical workaround on Windows when PowerShell blocks `.ps1` scripts.

---

## Error 2 — JSON Server Database Error

**Problem:**  
The API did not work correctly because there were errors in the `db.json` structure.

**Solution:**  
Fix the JSON structure and restart JSON Server. After that, the students API becomes available at:

```text
http://localhost:3000/students
```

**Notion Info / What I Learned:**  
A small JSON syntax error can prevent the whole API from working. Always validate `db.json` when JSON Server behaves unexpectedly.

---

## Error 3 — Students Appearing for Different Instructors

**Problem:**  
Students from other instructors were appearing on the Students page.

**Solution:**  
Add an `instructorId` to every student and filter students using the currently logged-in instructor's ID.

**Notion Info / What I Learned:**  
User-specific data should always be linked to the correct owner. Filtering by `instructorId` keeps instructor data separated.

---

## Error 4 — Deleted Students Still Appearing

**Problem:**  
We wanted deleted students to stay in the database but not appear in the UI.

**Solution:**  
Use a soft-delete system by setting:

```js
isDeleted: true
```

and filter those students out from the displayed list.

**Notion Info / What I Learned:**  
Soft delete is useful when data should be hidden without being permanently removed from the database.

---

## Error 5 — Update Form Not Loading Student Data

**Problem:**  
When clicking the Update button, the student's existing information was not displayed correctly in the form.

**Solution:**  
Fetch the student by ID and fill the update form fields using the returned student data.

**Notion Info / What I Learned:**  
Before editing existing data, the form should be populated with the current values from the database.

---

## Error 6 — Student Status Not Updating Correctly

**Problem:**  
The Active and Archived status was not selected correctly when updating a student.

**Solution:**  
Check the student's current `status` and automatically select the matching radio button.

**Notion Info / What I Learned:**  
Update forms should reflect the current database state so the user can clearly see what is already saved.

---

## Error 7 — Student ID Showing as Undefined

**Problem:**  
After removing the Student ID field from the form, `student.studentId` was still displayed under the student's name.

**Solution:**  
Remove Student ID from the table display because it is no longer part of the student data.

**Notion Info / What I Learned:**  
When a field is removed from the data model, all UI references to that field should also be removed.

---

## Error 8 — New Students Could Be Archived

**Problem:**  
New students could be created with Archived status, although every new student should start as Active.

**Solution:**  
Set:

```js
status: "active"
```

automatically when creating a student. Archived status should only be available while updating.

**Notion Info / What I Learned:**  
Business rules should be enforced in the code instead of relying only on user input.

---

## Error 9 — Courses Not Stored Correctly

**Problem:**  
Courses entered as text such as:

```text
JavaScript:90, React:85
```

were not stored in the required object format.

**Solution:**  
Split the input and convert each course into an object containing the course name and grade.

Example:

```js
[
  { name: "JavaScript", grade: 90 },
  { name: "React", grade: 85 }
]
```

**Notion Info / What I Learned:**  
User input sometimes needs to be transformed before it matches the database structure.

---

## Error 10 — Git Merge Conflict

**Problem:**  
After pulling changes from another branch, Git showed merge conflicts in files such as `student.js` and `students.html`.

**Solution:**  
Compare the current and incoming changes, keep the required code, remove conflict markers, then complete the merge with Git.

**Notion Info / What I Learned:**  
Merge conflicts should be reviewed carefully so team members' work is not accidentally overwritten.
