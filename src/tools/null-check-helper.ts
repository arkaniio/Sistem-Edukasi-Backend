export const UpdateData = <T extends object>(data: T): Partial<T> => {
  const update_data: Partial<T> = {};

  if (data && typeof data === 'object') {
    (Object.keys(data) as Array<keyof T>).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        update_data[key] = data[key];
      }
    });
  }

  return update_data;
};
