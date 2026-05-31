import { useState } from 'react';

export default function useApplicationModel() {
  const [applications, setApplications] = useState<any[]>([]);

  const addApplication = (application: any) => {
    setApplications([
      ...applications,
      application,
    ]);
  };

  const removeApplication = (id: number) => {
    setApplications(
      applications.filter(
        item => item.id !== id,
      ),
    );
  };

  const updateApplicationStatus = (
    id: number,
    status: string,
  ) => {
    setApplications(
      applications.map(item =>
        item.id === id
          ? { ...item, status }
          : item,
      ),
    );
  };

  return {
    applications,
    setApplications,
    addApplication,
    removeApplication,
    updateApplicationStatus,
  };
}