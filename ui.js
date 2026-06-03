import { state } from "./state.js";

// ─── DOM refs ────────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

const els = {
  tbody:      () => $("tbody"),
  overlay:    () => $("overlay"),
  modalTitle: () => $("modal-title"),
  toast:      () => $("toast"),
  sTotal:     () => $("s-total"),
  sWork:      () => $("s-work"),
  sVip:       () => $("s-vip"),
  saveBtn:    () => document.querySelector(".btn-save"),
  form: {
    first:  () => $("f-first"),
    last:   () => $("f-last"),
    email:  () => $("f-email"),
    phone:  () => $("f-phone"),
    tag:    () => $("f-tag"),
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLORS = [
  ["#E6F1FB", "#185FA5"],
  ["#EAF3DE", "#3B6D11"],
  ["#FAEEDA", "#854F0B"],
  ["#FBEAF0", "#993556"],
  ["#FAECE7", "#993C1D"],
];

function colorFor(name) {
  const i = ((name.charCodeAt(0) ?? 0) + (name.charCodeAt(1) ?? 0)) % COLORS.length;
  return COLORS[i];
}

function initials(first, last) {
  return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase();
}

// ─── Render ───────────────────────────────────────────────────────────────────

export function renderTable() {
  const rows   = state.filtered;
  const tbody  = els.tbody();

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty">no contacts found</div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((c) => {
    const [bg, fg] = colorFor(c.firstName + c.lastName);
    const tag      = c.tag ?? "work";

    return `
      <tr>
        <td>
          <div class="cell-name">
            <div class="avatar" style="background:${bg};color:${fg}">
              ${initials(c.firstName, c.lastName)}
            </div>
            <div class="name-text">${c.firstName} ${c.lastName}</div>
          </div>
        </td>
        <td style="font-family:var(--mono);font-size:12px;color:var(--ink2)">${c.email}</td>
        <td style="font-family:var(--mono);font-size:12px;color:var(--ink3)">${c.phone ?? "—"}</td>
        <td><span class="tag tag-${tag}">${tag}</span></td>
        <td>
          <div class="row-actions">
            <button class="btn-icon"     onclick="app.editContact('${c.userId}')"   aria-label="Edit ${c.firstName}"><i class="ti ti-edit"></i></button>
            <button class="btn-icon del" onclick="app.deleteContact('${c.userId}')" aria-label="Delete ${c.firstName}"><i class="ti ti-trash"></i></button>
          </div>
        </td>
      </tr>`;
  }).join("");
}

export function renderStats() {
  const { total, work, vip } = state.stats;
  els.sTotal().textContent = total;
  els.sWork().textContent  = work;
  els.sVip().textContent   = vip;
}

export function render() {
  renderTable();
  renderStats();
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function openModal(contact = null) {
  els.modalTitle().textContent = contact ? "Edit contact" : "New contact";

  els.form.first().value = contact?.firstName ?? "";
  els.form.last().value  = contact?.lastName  ?? "";
  els.form.email().value = contact?.email     ?? "";
  els.form.phone().value = contact?.phone     ?? "";
  els.form.tag().value   = contact?.tag       ?? "work";

  els.overlay().classList.add("open");
  els.form.first().focus();
}

export function closeModal() {
  els.overlay().classList.remove("open");
}

export function getFormValues() {
  return {
    firstName: els.form.first().value.trim(),
    lastName:  els.form.last().value.trim(),
    email:     els.form.email().value.trim(),
    phone:     els.form.phone().value.trim(),
    tag:       els.form.tag().value,
  };
}

// ─── Loading state ────────────────────────────────────────────────────────────

export function setLoading(on) {
  state.loading = on;
  const btn = els.saveBtn();
  if (!btn) return;
  btn.disabled    = on;
  btn.textContent = on ? "Saving…" : "Save";
}

// ─── Toast ────────────────────────────────────────────────────────────────────

let toastTimer;

export function showToast(msg, type = "info") {
  const t = els.toast();
  t.textContent = msg;
  t.className   = `toast show toast-${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

export function showError(msg) {
  showToast(msg, "error");
}
