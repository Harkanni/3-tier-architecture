const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s().+\-]*$/;

export function validateContact({ firstName, lastName, email, phone }) {
  if (!firstName.trim()) return "First name is required.";
  if (!lastName.trim())  return "Last name is required.";
  if (!email.trim())     return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
  if (phone && !PHONE_RE.test(phone)) return "Phone number contains invalid characters.";
  return null; // valid
}
