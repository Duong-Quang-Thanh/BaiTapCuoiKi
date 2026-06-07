import API from './api';

export const getUniversities =
  () => API.get('/universities');

export const createUniversity =
  (data: any) =>
    API.post(
      '/universities',
      data
    );

export const deleteUniversity =
  (id: number) =>
    API.delete(
      `/universities/${id}`
    );