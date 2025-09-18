const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reviewService = {
  async getAll() {
    try {
      await delay(200)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "product_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };

      const response = await apperClient.fetchRecords('review_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(review => ({
        Id: review.Id,
        rating: review.rating_c,
        comment: review.comment_c,
        author: review.author_c,
        createdAt: review.created_at_c,
        productId: review.product_id_c?.Id || review.product_id_c
      }));
    } catch (error) {
      console.error("Error fetching reviews:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(150)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "product_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };

      const response = await apperClient.getRecordById('review_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const review = response.data;
      return {
        Id: review.Id,
        rating: review.rating_c,
        comment: review.comment_c,
        author: review.author_c,
        createdAt: review.created_at_c,
        productId: review.product_id_c?.Id || review.product_id_c
      };
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByProductId(productId) {
    try {
      await delay(200)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "product_id_c"}}
        ],
        where: [{"FieldName": "product_id_c", "Operator": "EqualTo", "Values": [parseInt(productId)]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('review_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(review => ({
        Id: review.Id,
        rating: review.rating_c,
        comment: review.comment_c,
        author: review.author_c,
        createdAt: review.created_at_c,
        productId: review.product_id_c?.Id || review.product_id_c
      }));
    } catch (error) {
      console.error("Error fetching reviews by product:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(reviewData) {
    try {
      await delay(300)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          rating_c: reviewData.rating,
          comment_c: reviewData.comment,
          author_c: reviewData.author,
          created_at_c: new Date().toISOString(),
          product_id_c: parseInt(reviewData.productId)
        }]
      };

      const response = await apperClient.createRecord('review_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const review = successful[0].data;
          return {
            Id: review.Id,
            rating: review.rating_c,
            comment: review.comment_c,
            author: review.author_c,
            createdAt: review.created_at_c,
            productId: review.product_id_c?.Id || review.product_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, reviewData) {
    try {
      await delay(250)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          rating_c: reviewData.rating,
          comment_c: reviewData.comment,
          author_c: reviewData.author
        }]
      };

      const response = await apperClient.updateRecord('review_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const review = successful[0].data;
          return {
            Id: review.Id,
            rating: review.rating_c,
            comment: review.comment_c,
            author: review.author_c,
            createdAt: review.created_at_c,
            productId: review.product_id_c?.Id || review.product_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating review:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(200)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('review_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting review:", error?.response?.data?.message || error);
      return false;
    }
  }
}