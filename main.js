import { loadContacts, saveContact, newContact,
         editContact, deleteContact,
         filterContacts }                from "./contacts.js";
import { closeModal, openModal }         from "./ui.js";

// ─── Global bridge for inline HTML handlers ───────────────────────────────────

window.openModal    = () => { newContact(); };
window.closeModal   = closeModal;
window.saveContact  = saveContact;
window.render       = () => filterContacts(document.getElementById("search").value);
window.app          = { editContact, deleteContact };

// ─── Keyboard shortcut ────────────────────────────────────────────────────────

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

loadContacts();
