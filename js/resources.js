const API_URL = "http://localhost:3000"
const RES_URL = `${API_URL}/resources`;
const INSTRUCTOR = 1 // Todo: the logged-in instructor's id.
//? From Google cloud console -> create youtube API key -> save in config.js
import { YT_KEY } from "./config.js";

// Logged-in instructor (currentInstructor), Extract from session
const readSession = (key) => {
    try {
        return JSON.parse (sessionStorage.getItem (key) || localStorage.getItem (key) || null)
    } catch {
        return null;
    }
}

const instructor = readSession ("currentInstructor");
if (!instructor || !instructor.id) {
    location.href = "../index.html"; // Not logged in
    throw new Error ("No logged-in instructor");
}

const INSTRUCTORID = instructor.id;

let cources = []; // Current instructor courses





