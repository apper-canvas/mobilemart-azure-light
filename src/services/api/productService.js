const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(product => ({
        Id: product.Id,
        name: product.name_c,
        brand: product.brand_c,
        price: product.price_c,
        images: product.images_c ? JSON.parse(product.images_c) : [],
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {},
        description: product.description_c,
        rating: product.rating_c,
        reviewCount: product.review_count_c,
        inStock: product.in_stock_c,
        category: product.category_c
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };

      const response = await apperClient.getRecordById('product_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const product = response.data;
      return {
        Id: product.Id,
        name: product.name_c,
        brand: product.brand_c,
        price: product.price_c,
        images: product.images_c ? JSON.parse(product.images_c) : [],
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {},
        description: product.description_c,
        rating: product.rating_c,
        reviewCount: product.review_count_c,
        inStock: product.in_stock_c,
        category: product.category_c
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByBrand(brand) {
    try {
      await delay(250)
      const allProducts = await this.getAll();
      return allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    } catch (error) {
      console.error("Error fetching products by brand:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      await delay(300)
      const allProducts = await this.getAll();
      const searchTerm = query.toLowerCase()
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(productData) {
    try {
      await delay(400)
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: productData.name,
          brand_c: productData.brand,
          price_c: productData.price,
          images_c: JSON.stringify(productData.images || []),
          specifications_c: JSON.stringify(productData.specifications || {}),
          description_c: productData.description,
          rating_c: 0,
          review_count_c: 0,
          in_stock_c: true,
          category_c: productData.category
        }]
      };

      const response = await apperClient.createRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const product = successful[0].data;
          return {
            Id: product.Id,
            name: product.name_c,
            brand: product.brand_c,
            price: product.price_c,
            images: product.images_c ? JSON.parse(product.images_c) : [],
            specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {},
            description: product.description_c,
            rating: product.rating_c,
            reviewCount: product.review_count_c,
            inStock: product.in_stock_c,
            category: product.category_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, productData) {
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
          name_c: productData.name,
          brand_c: productData.brand,
          price_c: productData.price,
          images_c: JSON.stringify(productData.images || []),
          specifications_c: JSON.stringify(productData.specifications || {}),
          description_c: productData.description,
          rating_c: productData.rating,
          review_count_c: productData.reviewCount,
          in_stock_c: productData.inStock,
          category_c: productData.category
        }]
      };

      const response = await apperClient.updateRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const product = successful[0].data;
          return {
            Id: product.Id,
            name: product.name_c,
            brand: product.brand_c,
            price: product.price_c,
            images: product.images_c ? JSON.parse(product.images_c) : [],
            specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {},
            description: product.description_c,
            rating: product.rating_c,
            reviewCount: product.review_count_c,
            inStock: product.in_stock_c,
            category: product.category_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('product_c', params);
      
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
      console.error("Error deleting product:", error?.response?.data?.message || error);
      return false;
    }
  },

  // Browsing history and recommendation methods
  trackView(productId) {
    const history = this.getBrowsingHistory()
    const productIdInt = parseInt(productId)
    
    // Remove if already exists to avoid duplicates
    const filteredHistory = history.filter(id => id !== productIdInt)
    
    // Add to beginning and limit to 50 items
    const newHistory = [productIdInt, ...filteredHistory].slice(0, 50)
    
    localStorage.setItem('browsingHistory', JSON.stringify(newHistory))
  },

  getBrowsingHistory() {
    try {
      const history = localStorage.getItem('browsingHistory')
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error parsing browsing history:', error)
      return []
    }
  },

  async getRecommendations(currentProductId = null, limit = 8) {
    try {
      await delay(300)
      const history = this.getBrowsingHistory()
      
      const allProducts = await this.getAll();
      
      if (!history.length) {
        // Return random popular products if no history
        return allProducts
          .filter(p => p.rating >= 4.0)
          .sort(() => 0.5 - Math.random())
          .slice(0, limit)
      }

      // Get recently viewed products for similarity analysis
      const recentProducts = history.slice(0, 10)
        .map(id => allProducts.find(p => p.Id === id))
        .filter(Boolean)

      if (!recentProducts.length) {
        return []
      }

      // Get similar products based on recent viewing history
      const recommendations = this.getSimilarProducts(recentProducts, currentProductId, limit, allProducts)
      return recommendations
    } catch (error) {
      console.error("Error fetching recommendations:", error?.response?.data?.message || error);
      return [];
    }
  },

  getSimilarProducts(baseProducts, excludeId = null, limit = 8, allProducts = []) {
    const excludeIdInt = excludeId ? parseInt(excludeId) : null
    const scores = new Map()

    // Calculate similarity scores for all products
    allProducts.forEach(product => {
      if (product.Id === excludeIdInt) return
      
      let totalScore = 0
      let weightSum = 0

      baseProducts.forEach((baseProduct, index) => {
        const weight = 1 / (index + 1) // Recent items have higher weight
        let score = 0

        // Brand similarity (highest weight)
        if (product.brand === baseProduct.brand) {
          score += 40
        }

        // Category similarity
        if (product.category === baseProduct.category) {
          score += 30
        }

        // Price similarity (within 20% range)
        const priceDiff = Math.abs(product.price - baseProduct.price) / baseProduct.price
        if (priceDiff <= 0.2) {
          score += 20
        } else if (priceDiff <= 0.5) {
          score += 10
        }

        // Rating similarity
        const ratingDiff = Math.abs(product.rating - baseProduct.rating)
        if (ratingDiff <= 0.5) {
          score += 10
        }

        totalScore += score * weight
        weightSum += weight
      })

      const finalScore = weightSum > 0 ? totalScore / weightSum : 0
      if (finalScore > 0) {
        scores.set(product.Id, finalScore)
      }
    })

    // Sort by score and return top recommendations
    return Array.from(scores.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([productId]) => allProducts.find(p => p.Id === productId))
      .filter(Boolean)
  }
}