export default function () {
  return {
    admin:
      localStorage.getItem(
        'role'
      ) === 'admin',

    student:
      localStorage.getItem(
        'role'
      ) === 'student',
  };
}