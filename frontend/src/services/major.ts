import API from './api';

export interface Major {
  id: number;
  university_id: number;
  name: string;
}

export const getMajors = async (): Promise<Major[]> => {
  const response = await API.get('/majors');
  return response.data;
};

export const getMajorsByUniversity = async (universityId: number): Promise<Major[]> => {
  const response = await API.get(`/majors/university/${universityId}`);
  return response.data;
};

export const createMajor = (data: any) =>
  API.post('/majors', data);