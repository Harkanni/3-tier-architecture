const API_URL =
//   "https://YOUR_API_URL.execute-api.us-east-1.amazonaws.com/prod/contacts";
  "https://12ytb8w5x1.execute-api.us-east-1.amazonaws.com/prod"

const COLORS = [
  ["#E6F1FB", "#185FA5"],
  ["#EAF3DE", "#3B6D11"],
  ["#FAEEDA", "#854F0B"],
  ["#FBEAF0", "#993556"],
  ["#EAF3DE", "#3B6D11"],
  ["#FAECE7", "#993C1D"],
];

function colorFor(name) {
  const i =
    ((name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0)) %
    COLORS.length;

  return COLORS[i];
}

function initials(f, l) {
  return ((f[0] || "") + (l[0] || "")).toUpperCase();
}

let db = [];
let editId = null;

async function loadContacts() {
  try {
    const response = await fetch("https://12ytb8w5x1.execute-api.us-east-1.amazonaws.com/prod/users");

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
        }

    db = await response.json();

    render();
  } catch (error) {
    console.error(error);
    showToast("Failed to load contacts");
  }
}

function getFiltered() {
  const q = document.getElementById("search").value.toLowerCase();

  if (!q) return db;

  return db.filter((c) =>
    (
      c.first +
      " " +
      c.last +
      c.email +
      c.phone
    )
      .toLowerCase()
      .includes(q)
  );
}

function render() {
  const rows = getFiltered();
  const tbody = document.getElementById("tbody");

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="5"><div class="empty">no contacts found</div></td></tr>';
  } else {
    tbody.innerHTML = rows
      .map((c) => {
        console.log(c);
        const [bg, fg] = colorFor(c.firstName + c.lastName);
        const tagCls = "tag tag-" + `${c.tag || 'work'}`;

        return `
          <tr>
            <td>
              <div class="cell-name">
                <div
                  class="avatar"
                  style="background:${bg};color:${fg}"
                >
                  ${initials(c.firstName, c.lastName)}
                </div>

                <div>
                  <div class="name-text">
                    ${c.firstName} ${c.lastName}
                  </div>
                </div>
              </div>
            </td>

            <td style="font-family:var(--mono);font-size:12px;color:var(--ink2)">
              ${c.email}
            </td>

            <td style="font-family:var(--mono);font-size:12px;color:var(--ink3)">
              ${c.phone || " - "}
            </td>

            <td>
              <span class="${tagCls}">
                ${c.tag || 'work'}
              </span>
            </td>

            <td>
              <div class="row-actions">
                <button
                  class="btn-icon"
                  onclick="editContact('${c.userId}')"
                  aria-label="Edit ${c.firstName}"
                >
                  <i class="ti ti-edit"></i>
                </button>

                <button
                  class="btn-icon del"
                  onclick="deleteContact('${c.id}')"
                  aria-label="Delete ${c.firstName}"
                >
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  document.getElementById("s-total").textContent = db.length;

  document.getElementById("s-work").textContent =
    db.filter((c) => c.tag === "work").length;

  document.getElementById("s-vip").textContent =
    db.filter((c) => c.tag === "vip").length;
}

function openModal(id = null) {
  editId = id;

  if (id) {
    const c = db.find((x) => String(x.userId) === String(id));

    if (!c) return;

    document.getElementById("modal-title").textContent =
      "Edit contact";

    document.getElementById("f-first").value = c.firstName;
    document.getElementById("f-last").value = c.lastName;
    document.getElementById("f-email").value = c.email;
    document.getElementById("f-phone").value = c.phone || "";
    document.getElementById("f-tag").value = c.tag;
  } else {
    document.getElementById("modal-title").textContent =
      "New contact";

    ["f-first", "f-last", "f-email", "f-phone"].forEach(
      (i) => (document.getElementById(i).value = "")
    );

    document.getElementById("f-tag").value = "work";
  }

  document.getElementById("overlay").classList.add("open");
  document.getElementById("f-first").focus();
}

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
}

async function saveContact() {
  const firstName = document.getElementById("f-first").value.trim();
  const lastName = document.getElementById("f-last").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const tag = document.getElementById("f-tag").value;

  if (!firstName || !lastName || !email) {
    showToast("first name, last name & email required");
    return;
  }

  const payload = {
    firstName,
    lastName,
    email,
    phone,
    tag,
  };

  try {
    let response;

    if (editId) {
      response = await fetch(`https://12ytb8w5x1.execute-api.us-east-1.amazonaws.com/prod/edituser?userId=${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showToast("contact updated");
    } else {
      response = await fetch("https://12ytb8w5x1.execute-api.us-east-1.amazonaws.com/prod/insertuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showToast("contact added");
    }

    if (!response.ok) {
      throw new Error("Request failed");
    }

    closeModal();

    await loadContacts();
  } catch (error) {
    console.error(error);
    showToast("request failed");
  }
}

function editContact(id) {
  openModal(id);
}

async function deleteContact(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this contact?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`https://12ytb8w5x1.execute-api.us-east-1.amazonaws.com/prod/deleteuser/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    db = db.filter((c) => String(c.userId) !== String(id));

    render();

    showToast("contact deleted");
  } catch (error) {
    console.error(error);
    showToast("delete failed");
  }
}

let toastTimer;

function showToast(msg) {
  const t = document.getElementById("toast");

  t.textContent = msg;
  t.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

document
  .getElementById("overlay")
  .addEventListener("click", (e) => {
    if (e.target === document.getElementById("overlay")) {
      closeModal();
    }
  });

loadContacts();