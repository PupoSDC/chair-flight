import { apiHandler } from '@chair-flight/chair-flight-server-core';

export default apiHandler(
  {
    get: () => {
      return [];
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
