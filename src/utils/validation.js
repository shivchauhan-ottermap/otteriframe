export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function canStartTask({ name, email, phone }) {
  return name.trim().length >= 2 && isValidEmail(email) && isValidPhone(phone);
}
