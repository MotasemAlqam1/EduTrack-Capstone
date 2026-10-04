export const API_URL = "http://localhost:3000";

const readSession = (key) => {
  try {
    return JSON.parse(
      sessionStorage.getItem(key) || localStorage.getItem(key) || null,
    );
  } catch {
    return null;
  }
};

export const getInstructor = () => readSession("currentInstructor");

/**
 * Returns the logged-in instructor, or redirects and stops the module.
 * @param {string} redirectTo - where to go when nobody is logged in
 */
export const requireInstructor = (redirectTo = "index.html") => {
  const instructor = getInstructor();
  if (!instructor || !instructor.id) {
    location.href = redirectTo;
    throw new Error("No logged-in instructor");
  }
  return instructor;
};