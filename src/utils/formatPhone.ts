export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const match = digits.match(/^(\d{3})(\d{3,4})(\d{4})$/)
  return match ? `${match[1]} - ${match[2]} - ${match[3]}` : phone
}
