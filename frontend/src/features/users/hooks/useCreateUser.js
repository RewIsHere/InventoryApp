import { useState } from "react";
import { registerUserService } from "../services/userService";

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const result = await registerUserService(userData);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return {
    createUser,
    loading,
  };
};
