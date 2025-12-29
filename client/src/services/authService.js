export const authService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),
  
  getRole: () => localStorage.getItem('userRole'),
  setRole: (role) => localStorage.setItem('userRole', role),
  removeRole: () => localStorage.removeItem('userRole'),
  
  isAuthenticated: () => !!authService.getToken(),
  isRenter: () => authService.getRole() === 'renter',
  isSeller: () => authService.getRole() === 'seller',
  isAdmin: () => authService.getRole() === 'admin',
  
  logout: () => {
    authService.removeToken();
    authService.removeUser();
    authService.removeRole();
  }
};