import { loadContacts, saveContact, newContact,
         editContact, deleteContact,
         filterContacts }                from "./contacts.js";
import { closeModal }                    from "./ui.js";

// ─── Expose to inline HTML handlers ──────────────────────────────────────────
// Keeps onclick="..." in the HTML working without moving to full event delegation

window.app = { editContact, deleteContact };

// ─── Event listeners ──────────────────────────────────────────────────────────

document.getElementById("new-btn")
  .addEventListener("click", newContact);

document.getElementById("save-btn")
  .addEventListener("click", saveContact);

document.getElementById("search")
  .addEventListener("input", (e) => filterContacts(e.target.value));

document.getElementById("overlay")
  .addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

loadContacts();
