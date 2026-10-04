# Motasem Alqam — Common Errors & Solutions

## Error 1 — JSON Server Could Not Run in PowerShell

**Problem:**  
Running:

```bash
npx json-server db.json
```

showed an error saying script execution was disabled.

**Cause:**  
Windows PowerShell Execution Policy prevented `npx.ps1` from running.

**Solution:**  
Use:

```bash
npx.cmd json-server db.json
```

**Notion Info / What I Learned:**  
The problem was caused by the PowerShell environment, not JSON Server itself. I learned how Windows script execution policies can affect development commands.

---

## Error 2 — ReferenceError: tier1Cost is not defined

**Problem:**

```bash
ReferenceError: tier1Cost is not defined
```

**Cause:**  
The variable `tier1Cost` was used before it was defined correctly inside the function.

**Solution:**  
Check the variable declaration and trace the code step by step with `console.log()` to find where the value becomes missing.

**Notion Info / What I Learned:**  
I learned how to read a `ReferenceError`, trace the execution flow, and debug variables instead of changing code randomly.

---

## Error 3 — Git Merge Conflict

**Problem:**

```bash
CONFLICT both modified: db.json
CONFLICT both modified: js/resources.js
```

**Cause:**  
Both the feature branch and `main` modified the same files.

**Solution:**  
Compare both versions, choose the correct code, resolve the conflict, then run:

```bash
git add db.json
git add js/resources.js
git commit -m "Merge main into motasem-alqam"
```

**Notion Info / What I Learned:**  
I learned how Git handles conflicting changes and how to resolve them without deleting or overwriting team members' work.

---

## Error 4 — Courses CRUD Data Isolation Bug

**Problem:**  
The Courses page filtered courses correctly when displaying them, but Edit and Delete did not verify that the selected course belonged to the logged-in instructor.

**Cause:**  
The GET request used `instructorId` filtering, but PATCH and DELETE operations did not perform the same ownership check.

**Solution:**  
Add an ownership check before modifying data:

```js
if (course.instructorId !== INSTRUCTORID) {
  alert("You cannot edit this course.");
  return;
}
```

Use equivalent checks for delete and update operations.

**Notion Info / What I Learned:**  
Filtering data in the UI is not enough. Every operation that modifies data should also validate ownership.

---

## Error 5 — Invalid HTML Structure

**Problem:**  
The Resources navigation link was accidentally placed inside the `<head>` section of `courses.html`.

**Cause:**  
The navigation element was duplicated and inserted in the wrong location.

**Solution:**  
Remove the invalid `<a>` element from `<head>` and keep the navigation link inside the sidebar in `<body>`.

**Notion Info / What I Learned:**  
Valid HTML structure matters even when the page still looks correct visually. Inspecting the DOM helps catch structural issues.
