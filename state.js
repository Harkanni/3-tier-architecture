export const state = {
  contacts: [],
  editId:   null,
  query:    "",
  loading:  false,

  get filtered() {
    const q = this.query.toLowerCase();
    if (!q) return this.contacts;
    return this.contacts.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.email} ${c.phone ?? ""}`.toLowerCase().includes(q)
    );
  },

  get stats() {
    return {
      total: this.contacts.length,
      work:  this.contacts.filter((c) => c.tag === "work").length,
      vip:   this.contacts.filter((c) => c.tag === "vip").length,
    };
  },
};
