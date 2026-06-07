import API from './api';

export const getMajors =
  () => API.get('/majors');

export const createMajor =
  (data: any) =>
    API.post(
      '/majors',
      data
    );