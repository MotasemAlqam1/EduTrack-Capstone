# Ahmad Hwari — Common Errors & Solutions

## Error 1

```bash
SyntaxError: Unexpected token in JSON at position ... (db.json)
```

**Solution:**  
After a merge, `db.json` had a missing comma and a duplicate `assessments` key. Fix the JSON structure.

**Notion Info / What I Learned:**  
Merge conflicts can leave JSON files syntactically invalid. JSON should be validated after resolving conflicts.

---

## Error 2

```text
Page layout broken after merge
(two <head> and two <body> elements in one file)
```

**Solution:**  
Remove the old duplicated block and keep one clean version of the page.

**Notion Info / What I Learned:**  
When merging HTML files, duplicated structural tags can break the page even if each version worked separately.

---

## Error 3

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**  
Another JSON Server process was already running. Stop it with:

```bash
taskkill /F /IM node.exe
```

**Notion Info / What I Learned:**  
Only one process can normally use the same port at a time. `EADDRINUSE` usually means another application is already using that port.

---

## Error 4

```bash
npx : File cannot be loaded because running scripts is disabled on this system
```

**Solution:**  
Use:

```bash
npx.cmd json-server db.json
```

instead of `npx` in PowerShell.

**Notion Info / What I Learned:**  
PowerShell execution policy can block `.ps1` scripts. Using the `.cmd` executable is a practical Windows workaround.

---

## Error 5

```text
Page reloads after every add / edit / delete
```

**Solution:**  
Live Server was watching `db.json`. Add it to `liveServer.settings.ignoreFiles`.

**Notion Info / What I Learned:**  
Development tools can react to file changes automatically. Ignoring `db.json` prevents unnecessary page reloads while JSON Server updates the file.

---

## Error 6

```bash
TypeError: Cannot set properties of null (setting 'textContent')
```

**Solution:**  
`profile.js` was using an element that exists only on the dashboard. Add a check:

```js
if (instructorName) {
  // update the element
}
```

**Notion Info / What I Learned:**  
When the same JavaScript file is used on multiple pages, always verify that an element exists before accessing or modifying it.

---

## Error 7

```text
Change password form did nothing on submit
```

**Solution:**  
The event name was empty:

```js
addEventListener("")
```

Change it to:

```js
addEventListener("submit", ...)
```

**Notion Info / What I Learned:**  
Event listeners require the correct event name. A missing or incorrect event type prevents the handler from running.

---

## Error 8

```text
After editing an item and closing the modal, "Add" updated the old item
```

**Solution:**  
`editingId` was not reset. Reset it inside the `hidden.bs.modal` event.

**Notion Info / What I Learned:**  
Temporary state used for editing should be cleared when the modal closes so the next action starts cleanly.

---

## Error 9

```text
Light mode flashes before dark mode on every page load
```

**Solution:**  
`theme.js` loaded at the end of the page. Add a small script inside `<head>` that sets `data-theme` before the page renders.

**Notion Info / What I Learned:**  
Theme state should be applied as early as possible to avoid a visible flash of the wrong theme.

---

## Error 10

```text
instructorId was removed from assessment after editing
```

**Solution:**  
`PUT` replaces the whole object. Use `PATCH` to update only the form fields.

**Notion Info / What I Learned:**  
Use `PATCH` when only part of an object should change. `PUT` can remove properties that are not included in the replacement object.
