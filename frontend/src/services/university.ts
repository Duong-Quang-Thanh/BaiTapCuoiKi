import API from './api';

export interface University {
  id: number;
  name: string;
}

export const getUniversities = async (): Promise<University[]> => {
  const response = await API.get('/universities');
  return response.data;
};

export const createUniversity = (data: any) =>
  API.post('/universities', data);

export const deleteUniversity = (id: number) =>
  API.delete(`/universities/${id}`);