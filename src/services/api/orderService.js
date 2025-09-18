// Mock order storage (in a real app, this would be a database)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const orderService = {
  async getAll() {
    try {
      await delay(300)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "customer_info_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('order_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(order => ({
        Id: order.Id,
        items: order.items_c ? JSON.parse(order.items_c) : [],
        total: order.total_c,
        customerInfo: order.customer_info_c ? JSON.parse(order.customer_info_c) : {},
        status: order.status_c,
        createdAt: order.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
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
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "customer_info_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById('order_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const order = response.data;
      return {
        Id: order.Id,
        items: order.items_c ? JSON.parse(order.items_c) : [],
        total: order.total_c,
        customerInfo: order.customer_info_c ? JSON.parse(order.customer_info_c) : {},
        status: order.status_c,
        createdAt: order.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(orderData) {
    try {
      await delay(500) // Simulate processing time
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          items_c: JSON.stringify(orderData.items),
          total_c: orderData.total,
          customer_info_c: JSON.stringify(orderData.customerInfo),
          status_c: "pending",
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const order = successful[0].data;
          return {
            Id: order.Id,
            items: order.items_c ? JSON.parse(order.items_c) : [],
            total: order.total_c,
            customerInfo: order.customer_info_c ? JSON.parse(order.customer_info_c) : {},
            status: order.status_c,
            createdAt: order.created_at_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, orderData) {
    try {
      await delay(300)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          items_c: JSON.stringify(orderData.items),
          total_c: orderData.total,
          customer_info_c: JSON.stringify(orderData.customerInfo),
          status_c: orderData.status
        }]
      };

      const response = await apperClient.updateRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const order = successful[0].data;
          return {
            Id: order.Id,
            items: order.items_c ? JSON.parse(order.items_c) : [],
            total: order.total_c,
            customerInfo: order.customer_info_c ? JSON.parse(order.customer_info_c) : {},
            status: order.status_c,
            createdAt: order.created_at_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating order:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(300)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('order_c', params);
      
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
      console.error("Error deleting order:", error?.response?.data?.message || error);
      return false;
    }
  }
}