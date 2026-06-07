export function onRouteChange({
  location,
}: any) {
  const role =
    localStorage.getItem('role');

  const token =
    localStorage.getItem('token');

  // Allow public access to universities page
  if (location.pathname === '/universities') {
    return;
  }

  if (
    location.pathname !== '/' &&
    location.pathname !== '/register'
  ) {
    if (!token) {
      window.location.href = '/';
      return;
    }
  }

  if (
    location.pathname.startsWith(
      '/admin',
    )
  ) {
    if (role !== 'admin') {
      window.location.href = '/';
    }
  }

  if (
    location.pathname.startsWith(
      '/student',
    )
  ) {
    if (
      role !== 'student' &&
      role !== 'admin'
    ) {
      window.location.href = '/';
    }
  }
}