import { useState } from 'react';

export default function useUserModel() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const login = (userData: any) => {
    setCurrentUser(userData);
    localStorage.setItem(
      'currentUser',
      JSON.stringify(userData),
    );
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const loadUser = () => {
    const user = localStorage.getItem('currentUser');

    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  };

  return {
    currentUser,
    login,
    logout,
    loadUser,
  };
}