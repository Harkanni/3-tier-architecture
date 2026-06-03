import { api }                          from "./api.js";
import { state }                         from "./state.js";
import { validateContact }               from "./validation.js";
import { render, openModal, closeModal,
         getFormValues, setLoading,
         showToast, showError }          from "./ui.js";

export async function loadContacts() {
  try {
    state.contacts = await api.getContacts();
    render();
  } catch (err) {
    console.error(err);
    showError("Could not load contacts — check your connection and retry.");
  }
}

export function editContact(id) {
  const contact = state.contacts.find((c) => String(c.userId) === String(id));
  if (!contact) return;
  state.editId = id;
  openModal(contact);
}

export function newContact() {
  state.editId = null;
  openModal(null);
}

export async function saveContact() {
  const values = getFormValues();
  const error  = validateContact(values);

  if (error) {
    showError(error);
    return;
  }

  setLoading(true);

  try {
    if (state.editId) {
      await api.updateContact(state.editId, values);
      showToast("Contact updated.");
    } else {
      await api.createContact(values);
      showToast("Contact added.");
    }
    closeModal();
    await loadContacts();
  } catch (err) {
    console.error(err);
    showError("Save failed — please try again.");
  } finally {
    setLoading(false);
  }
}

export async function deleteContact(id) {
  if (!confirm("Delete this contact?")) return;

  try {
    await api.deleteContact(id);
    state.contacts = state.contacts.filter((c) => String(c.userId) !== String(id));
    render();
    showToast("Contact deleted.");
  } catch (err) {
    console.error(err);
    showError("Delete failed — please try again.");
  }
}

export function filterContacts(query) {
  state.query = query;
  render();
}
