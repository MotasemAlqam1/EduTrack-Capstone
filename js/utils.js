/** Makes text safe to put inside HTML. */
export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

/** First letter of the first and last name: "Ahmad Ali Khaled" -> "AK". */
export const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Small popup message that disappears by itself.
 * type: "success" | "error" | "info"
 */
export function toast(message, type = "success", duration = 3000) {
  let box = document.getElementById("toastBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "toastBox";
    box.className = "toast-box";
    document.body.appendChild(box);
  }

  const icons = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    info: "bi-info-circle-fill",
  };

  const item = document.createElement("div");
  item.className = `app-toast app-toast-${type}`;
  item.setAttribute("role", type === "error" ? "alert" : "status");
  item.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i><span></span>`;
  item.querySelector("span").textContent = message; // textContent = safe, no esc() needed

  const close = () => {
    item.classList.remove("is-in");
    setTimeout(() => item.remove(), 250);
  };
  item.addEventListener("click", close);

  box.appendChild(item);
  requestAnimationFrame(() => item.classList.add("is-in"));
  setTimeout(close, duration);
}