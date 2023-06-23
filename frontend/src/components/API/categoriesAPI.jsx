import axios from "axios";

export const categoriesAPI = {
  getCategories: async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },
};
