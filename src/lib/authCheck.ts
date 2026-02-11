export function getAuthUser() {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  return userId && role ? { userId, role } : null;
}

export function logout(router: any) {
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("verifiedMobile");
  router.replace("/auth"); // Use replace to prevent back button loops
}
