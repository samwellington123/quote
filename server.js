require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

// Configuration
const CONFIG = {
  PANDADOC_API_KEY: process.env.PANDADOC_API_KEY,
  PANDADOC_API_URL: 'https://api.pandadoc.com/public/v1',
  AWS_BUCKET_URL: process.env.AWS_BUCKET_URL || 'https://leadprocessor.s3.us-east-2.amazonaws.com',
  PORT: process.env.PORT || 3000
};

// [Keep your existing PRODUCTS array as-is]
const PRODUCTS = [
    {
      id: 'PROD001',
      name: 'Premium T-Shirt - Black',
      sku: 'TSHIRT-18500-BLACK',
      category: 'apparel',
      description: 'Premium cotton t-shirt with custom logo',
      imageFile: '18500_Black_Flat_Front-01_big_back.png',
      pricing: [
        { minQty: 1, maxQty: 9, price: 29.99 },
        { minQty: 10, maxQty: 49, price: 26.99 },
        { minQty: 50, maxQty: 99, price: 23.99 },
        { minQty: 100, maxQty: null, price: 19.99 }
      ]
    },
    {
      id: 'PROD002',
      name: 'Premium T-Shirt - Dark Chocolate',
      sku: 'TSHIRT-18500-CHOC',
      category: 'apparel',
      description: 'Premium cotton t-shirt in dark chocolate with custom logo',
      imageFile: '18500_Dark Chocolate_Flat_Front-01_big_back.png',  // Has space in filename
      pricing: [
        { minQty: 1, maxQty: 9, price: 29.99 },
        { minQty: 10, maxQty: 49, price: 26.99 },
        { minQty: 50, maxQty: 99, price: 23.99 },
        { minQty: 100, maxQty: null, price: 19.99 }
      ]
    },
    {
      id: 'PROD003',
      name: 'Classic T-Shirt - Black',
      sku: 'TSHIRT-2000-BLACK',
      category: 'apparel',
      description: 'Classic fit t-shirt with custom logo',
      imageFile: '2000_black_flat_front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 19, price: 24.99 },
        { minQty: 20, maxQty: 99, price: 21.99 },
        { minQty: 100, maxQty: 499, price: 18.99 },
        { minQty: 500, maxQty: null, price: 15.99 }
      ]
    },
    {
      id: 'PROD004',
      name: 'Classic T-Shirt - Charcoal',
      sku: 'TSHIRT-2000-CHARCOAL',
      category: 'apparel',
      description: 'Classic fit charcoal t-shirt with custom logo',
      imageFile: '2000_charcoal_flat_front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 19, price: 24.99 },
        { minQty: 20, maxQty: 99, price: 21.99 },
        { minQty: 100, maxQty: 499, price: 18.99 },
        { minQty: 500, maxQty: null, price: 15.99 }
      ]
    },
    {
      id: 'PROD005',
      name: 'Heavy Cotton T-Shirt - Black',
      sku: 'TSHIRT-5400-BLACK',
      category: 'apparel',
      description: 'Heavy cotton t-shirt with custom logo',
      imageFile: '5400_black_flat_front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 24, price: 19.99 },
        { minQty: 25, maxQty: 99, price: 17.99 },
        { minQty: 100, maxQty: 999, price: 14.99 },
        { minQty: 1000, maxQty: null, price: 12.99 }
      ]
    },
    {
      id: 'PROD006',
      name: 'Canvas T-Shirt - Duck Brown',
      sku: 'CSV40-DUCKBROWN',
      category: 'apparel',
      description: 'Canvas v-neck t-shirt in duck brown with custom logo',
      imageFile: 'CSV40_duckbrown_flat_front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 49, price: 22.99 },
        { minQty: 50, maxQty: 249, price: 19.99 },
        { minQty: 250, maxQty: 999, price: 16.99 },
        { minQty: 1000, maxQty: null, price: 14.99 }
      ]
    },
    {
      id: 'PROD007',
      name: 'Safety T-Shirt - Yellow',
      sku: 'CSV106-SAFETY',
      category: 'apparel',
      description: 'High visibility safety yellow t-shirt with custom logo',
      imageFile: 'CSV106_safetyyellow_flat_front_right_chest.png',  // No -01 in this one
      pricing: [
        { minQty: 1, maxQty: 49, price: 18.99 },
        { minQty: 50, maxQty: 249, price: 16.99 },
        { minQty: 250, maxQty: 999, price: 14.99 },
        { minQty: 1000, maxQty: null, price: 12.99 }
      ]
    },
    {
      id: 'PROD008',
      name: 'Casual T-Shirt - Black',
      sku: 'CT104050-BLACK',
      category: 'apparel',
      description: 'Casual black t-shirt with custom logo',
      imageFile: 'CT104050_black_flat_front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 49, price: 26.99 },
        { minQty: 50, maxQty: 249, price: 23.99 },
        { minQty: 250, maxQty: 999, price: 20.99 },
        { minQty: 1000, maxQty: null, price: 17.99 }
      ]
    },
    {
      id: 'PROD009',
      name: 'Casual T-Shirt - Carhartt Brown',
      sku: 'CT104050-BROWN',
      category: 'apparel',
      description: 'Casual Carhartt brown t-shirt with custom logo',
      imageFile: 'CT104050_carharttbrown_flat_front-01_right_chest.png',  // Note: carharttbrown is one word
      pricing: [
        { minQty: 1, maxQty: 49, price: 26.99 },
        { minQty: 50, maxQty: 249, price: 23.99 },
        { minQty: 250, maxQty: 999, price: 20.99 },
        { minQty: 1000, maxQty: null, price: 17.99 }
      ]
    },
    {
      id: 'PROD010',
      name: 'Fashion T-Shirt - Black',
      sku: 'F170-BLACK',
      category: 'apparel',
      description: 'Fashion fit black t-shirt with custom logo',
      imageFile: 'F170_Black_flat_front-01_big_back.png',  // Capital B in Black
      pricing: [
        { minQty: 1, maxQty: 49, price: 21.99 },
        { minQty: 50, maxQty: 249, price: 19.99 },
        { minQty: 250, maxQty: 999, price: 16.99 },
        { minQty: 1000, maxQty: null, price: 14.99 }
      ]
    },
    {
      id: 'PROD011',
      name: 'Heavy Blend T-Shirt - Black',
      sku: 'G2400-BLACK',
      category: 'apparel',
      description: 'Heavy blend black t-shirt with custom logo',
      imageFile: 'G2400_black_flat_front-01_big_back.png',  // Lowercase black
      pricing: [
        { minQty: 1, maxQty: 49, price: 23.99 },
        { minQty: 50, maxQty: 249, price: 20.99 },
        { minQty: 250, maxQty: 999, price: 17.99 },
        { minQty: 1000, maxQty: null, price: 15.99 }
      ]
    },
    {
      id: 'PROD012',
      name: 'Heavy Blend T-Shirt - Charcoal',
      sku: 'G2400-CHARCOAL',
      category: 'apparel',
      description: 'Heavy blend charcoal t-shirt with custom logo',
      imageFile: 'G2400_charcoal_flat_front-01_big_back.png',
      pricing: [
        { minQty: 1, maxQty: 49, price: 23.99 },
        { minQty: 50, maxQty: 249, price: 20.99 },
        { minQty: 250, maxQty: 999, price: 17.99 },
        { minQty: 1000, maxQty: null, price: 15.99 }
      ]
    },
    {
      id: 'PROD013',
      name: 'Heavy Blend T-Shirt - Dark Chocolate',
      sku: 'G2400-DARKCHOC',
      category: 'apparel',
      description: 'Heavy blend dark chocolate t-shirt with custom logo',
      imageFile: 'G2400_darkchocolate_flat_front-01_big_back.png',  // darkchocolate is one word
      pricing: [
        { minQty: 1, maxQty: 49, price: 23.99 },
        { minQty: 50, maxQty: 249, price: 20.99 },
        { minQty: 250, maxQty: 999, price: 17.99 },
        { minQty: 1000, maxQty: null, price: 15.99 }
      ]
    },
    {
      id: 'PROD014',
      name: 'Lightweight T-Shirt - Black',
      sku: 'K540-BLACK',
      category: 'apparel',
      description: 'Lightweight black t-shirt with custom logo',
      imageFile: 'K540_Black_Flat_Front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 49, price: 27.99 },
        { minQty: 50, maxQty: 249, price: 24.99 },
        { minQty: 250, maxQty: 999, price: 21.99 },
        { minQty: 1000, maxQty: null, price: 18.99 }
      ]
    },
    {
      id: 'PROD015',
      name: 'Nike Dri-FIT T-Shirt - Black',
      sku: 'NKCY9963-BLACK',
      category: 'apparel',
      description: 'Nike Dri-FIT performance t-shirt with custom logo',
      imageFile: 'NKDC1963_Black_Flat_Front-01_right_chest.png',  // Note: NKDC not NKCY
      pricing: [
        { minQty: 1, maxQty: 24, price: 44.99 },
        { minQty: 25, maxQty: 99, price: 40.99 },
        { minQty: 100, maxQty: 499, price: 36.99 },
        { minQty: 500, maxQty: null, price: 32.99 }
      ]
    },
    {
      id: 'PROD016',
      name: 'Performance T-Shirt - Black',
      sku: 'PC78SP-BLACK',
      category: 'apparel',
      description: 'Performance jet black t-shirt with custom logo',
      imageFile: 'PC78SP_JET BLACK_Flat_Front-01_right_chest.png',  // JET BLACK with space
      pricing: [
        { minQty: 1, maxQty: 49, price: 31.99 },
        { minQty: 50, maxQty: 249, price: 28.99 },
        { minQty: 250, maxQty: 999, price: 25.99 },
        { minQty: 1000, maxQty: null, price: 22.99 }
      ]
    },
    {
      id: 'PROD017',
      name: 'Tri-Blend T-Shirt - Black',
      sku: 'TL1763H-BLACK',
      category: 'apparel',
      description: 'Tri-blend black t-shirt with custom logo',
      imageFile: 'TLJ763H_Black_Flat_Front-01_right_chest.png',  // Note: TLJ not TL1
      pricing: [
        { minQty: 1, maxQty: 49, price: 34.99 },
        { minQty: 50, maxQty: 249, price: 31.99 },
        { minQty: 250, maxQty: 999, price: 27.99 },
        { minQty: 1000, maxQty: null, price: 24.99 }
      ]
    },
    {
      id: 'PROD018',
      name: 'Tri-Blend T-Shirt - Duck Brown',
      sku: 'TL1763H-DUCKBROWN',
      category: 'apparel',
      description: 'Tri-blend duck brown t-shirt with custom logo',
      imageFile: 'TLJ763H_Duck Brown_Flat_Front-01_right_chest.png',  // Duck Brown with space
      pricing: [
        { minQty: 1, maxQty: 49, price: 34.99 },
        { minQty: 50, maxQty: 249, price: 31.99 },
        { minQty: 250, maxQty: 999, price: 27.99 },
        { minQty: 1000, maxQty: null, price: 24.99 }
      ]
    },
    {
      id: 'PROD019',
      name: 'Grey Steel T-Shirt - Orange Logo',
      sku: 'C112-GREYSTEEL',
      category: 'apparel',
      description: 'Grey steel t-shirt with neon orange custom logo',
      imageFile: 'C112_greysteelneonorange_full_front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 49, price: 28.99 },
        { minQty: 50, maxQty: 249, price: 25.99 },
        { minQty: 250, maxQty: 999, price: 22.99 },
        { minQty: 1000, maxQty: null, price: 19.99 }
      ]
    },
    {
      id: 'PROD020',
      name: 'Classic Polo - Black',
      sku: 'C932-BLACK',
      category: 'apparel',
      description: 'Classic black polo shirt with embroidered logo',
      imageFile: 'C932_Black_Flat_Front-01_right_chest.png',
      pricing: [
        { minQty: 1, maxQty: 19, price: 39.99 },
        { minQty: 20, maxQty: 99, price: 35.99 },
        { minQty: 100, maxQty: 499, price: 31.99 },
        { minQty: 500, maxQty: null, price: 27.99 }
      ]
    }
  ];

// Function to convert email to S3 folder format
function emailToS3Folder(email) {
  return email.toLowerCase()
    .replace(/@/g, '_at_')
    .replace(/\./g, '_dot_');
}

// Function to generate AWS image URL based on customer email
function getProductImageUrl(product, customerEmail) {
  if (!customerEmail) return null;
  const emailFolder = emailToS3Folder(customerEmail);
  // Don't encode the filename - S3 URLs should use the raw filename
  return `${CONFIG.AWS_BUCKET_URL}/${emailFolder}/mockups/${product.imageFile}`;
}

// Utility function to calculate price based on quantity
function calculatePrice(product, quantity) {
  const tier = product.pricing.find(p => 
    quantity >= p.minQty && (p.maxQty === null || quantity <= p.maxQty)
  );
  return tier ? tier.price : product.pricing[0].price;
}

// Utility function to get pricing table for a product
function getPricingTable(product) {
  return product.pricing.map(tier => ({
    quantity_range: tier.maxQty ? `${tier.minQty}-${tier.maxQty}` : `${tier.minQty}+`,
    price_per_unit: `$${tier.price.toFixed(2)}`
  }));
}

// PandaDoc API wrapper class
class PandaDocAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      'Authorization': `API-Key ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async createDocument(data) {
    try {
      console.log('Sending to PandaDoc:', JSON.stringify(data, null, 2));
      const response = await axios.post(
        `${CONFIG.PANDADOC_API_URL}/documents`,
        data,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating document:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  }

  async sendDocument(documentId) {
    try {
      const response = await axios.post(
        `${CONFIG.PANDADOC_API_URL}/documents/${documentId}/send`,
        {
          message: 'Please review and sign your document',
          silent: false
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending document:', error.response?.data || error.message);
      throw error;
    }
  }

  async getDocumentStatus(documentId) {
    try {
      const response = await axios.get(
        `${CONFIG.PANDADOC_API_URL}/documents/${documentId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting document status:', error);
      throw error;
    }
  }

  async waitForDocument(documentId, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getDocumentStatus(documentId);
      if (status.status === 'document.draft') {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return false;
  }
}

// Document builder class
class DocumentBuilder {
  constructor(type, customerInfo = {}) {
    this.type = type; // 'quote' or 'invoice'
    this.customerInfo = customerInfo;
    this.items = [];
    this.subtotal = 0;
    this.tax = 0;
    this.total = 0;
  }

  addProduct(productId, quantity) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const unitPrice = calculatePrice(product, quantity);
    const totalPrice = unitPrice * quantity;

    this.items.push({
      product,
      quantity,
      unitPrice,
      totalPrice,
      pricingTable: getPricingTable(product)
    });

    this.calculateTotals();
    return this;
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.tax = this.subtotal * 0.08; // 8% tax rate
    this.total = this.subtotal + this.tax;
  }

  buildPandaDocPayload() {
    const documentName = this.type === 'quote' 
      ? `Quote for ${this.customerInfo.company || this.customerInfo.name} - ${new Date().toLocaleDateString()}` 
      : `Invoice #${Date.now().toString().slice(-6)}`;

    const customerEmail = this.customerInfo.email || 'default@example.com';

    const payload = {
      name: documentName,
      template_uuid: this.type === 'quote' 
        ? process.env.PANDADOC_TEMPLATE_ID_QUOTE 
        : process.env.PANDADOC_TEMPLATE_ID_INVOICE,
      recipients: [
        {
          email: this.customerInfo.email || 'customer@example.com',
          first_name: this.customerInfo.firstName || this.customerInfo.name?.split(' ')[0] || 'Customer',
          last_name: this.customerInfo.lastName || this.customerInfo.name?.split(' ')[1] || '',
          role: "Client"
        }
      ],
      tokens: [
        { name: 'customer.name', value: this.customerInfo.name || '' },
        { name: 'customer.company', value: this.customerInfo.company || '' },
        { name: 'customer.email', value: this.customerInfo.email || '' },
        { name: 'customer.phone', value: this.customerInfo.phone || '' },
        { name: 'document.date', value: new Date().toLocaleDateString() },
        { name: 'document.number', value: documentName }
      ],
      fields: {},
      metadata: {
        type: this.type,
        createdAt: new Date().toISOString(),
        customerEmail: customerEmail
      }
    };

    // Add products to pricing table
    if (this.items.length > 0) {
      payload.pricing_tables = [
        {
          name: 'Pricing Table 1', // Make sure this EXACTLY matches your template
          data_merge: false,
          options: {
            currency: "USD",
            discount: {
              type: "absolute",
              name: "Discount",
              value: 0
            }
          },
          sections: [
            {
              title: 'Custom Branded Products',
              default: true,
              multichoice_enabled: false,
              rows: this.items.map((item, index) => {
                const imageUrl = getProductImageUrl(item.product, customerEmail);
                
                // Build volume pricing display
                const volumePricingText = item.product.pricing
                  .map(tier => {
                    if (tier.maxQty) {
                      return `${tier.minQty}-${tier.maxQty} units: $${tier.price.toFixed(2)}`;
                    } else {
                      return `${tier.minQty}+ units: $${tier.price.toFixed(2)}`;
                    }
                  })
                  .join(' | ');

                // Create a formatted description with image link
                const descriptionWithImage = imageUrl 
                  ? `${item.product.description}\n\nView Product: ${imageUrl}\n\nVolume Pricing:\n${volumePricingText}`
                  : `${item.product.description}\n\nVolume Pricing:\n${volumePricingText}`;

                return {
                  options: {
                    optional: false,
                    optional_selected: true,
                    qty_editable: true
                  },
                  data: {
                    Name: item.product.name,
                    Description: descriptionWithImage,
                    Price: item.unitPrice,
                    QTY: item.quantity,
                    SKU: item.product.sku
                  },
                  custom_fields: {
                    "Product_Image": imageUrl || "",
                    "Volume_Pricing": volumePricingText,
                    "Applied_Tier": `${item.quantity} units @ $${item.unitPrice.toFixed(2)} each`
                  }
                };
              })
            }
          ]
        }
      ];
    }

    // Add totals as tokens
    payload.tokens.push(
      { name: 'totals.subtotal', value: `$${this.subtotal.toFixed(2)}` },
      { name: 'totals.tax', value: `$${this.tax.toFixed(2)}` },
      { name: 'totals.total', value: `$${this.total.toFixed(2)}` }
    );

    // Add shipping address for invoices
    if (this.type === 'invoice' && this.customerInfo.shippingAddress) {
      const addr = this.customerInfo.shippingAddress;
      payload.tokens.push(
        { name: 'shipping.address', value: addr.street || '' },
        { name: 'shipping.city', value: addr.city || '' },
        { name: 'shipping.state', value: addr.state || '' },
        { name: 'shipping.zip', value: addr.zip || '' },
        { name: 'shipping.full', value: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}` }
      );
    }

    return payload;
  }
}

// Express middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Get all products with pricing
app.get('/api/products', (req, res) => {
  const { customerEmail } = req.query;
  
  const productsWithCurrentPricing = PRODUCTS.map(product => ({
    ...product,
    currentPrice: product.pricing[0].price,
    pricingTable: getPricingTable(product),
    previewImageUrl: customerEmail ? getProductImageUrl(product, customerEmail) : null
  }));
  res.json(productsWithCurrentPricing);
});

// Calculate price for specific quantity
app.post('/api/calculate-price', (req, res) => {
  const { productId, quantity } = req.body;
  const product = PRODUCTS.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const unitPrice = calculatePrice(product, quantity);
  const totalPrice = unitPrice * quantity;
  const basePrice = product.pricing[0].price;
  const savings = quantity > 1 ? (basePrice * quantity) - totalPrice : 0;

  const appliedTier = product.pricing.find(p => 
    quantity >= p.minQty && (p.maxQty === null || quantity <= p.maxQty)
  );

  res.json({
    productId,
    quantity,
    unitPrice,
    totalPrice,
    savings: savings.toFixed(2),
    pricingTier: appliedTier
  });
});

// Create quote
app.post('/api/create-quote', async (req, res) => {
  try {
    const { products, customerInfo } = req.body;
    
    if (!customerInfo.email) {
      return res.status(400).json({ 
        error: 'Customer email required for branded merchandise images' 
      });
    }
    
    const pandadoc = new PandaDocAPI(CONFIG.PANDADOC_API_KEY);
    const builder = new DocumentBuilder('quote', customerInfo);
    
    // Add all products with their quantities
    for (const item of products) {
      builder.addProduct(item.productId, item.quantity);
    }

    const payload = builder.buildPandaDocPayload();
    const document = await pandadoc.createDocument(payload);

    // Wait for document to be ready then send
    const isReady = await pandadoc.waitForDocument(document.id);
    if (isReady) {
      try {
        await pandadoc.sendDocument(document.id);
      } catch (error) {
        console.error('Error sending document:', error);
      }
    }

    res.json({
      success: true,
      documentId: document.id,
      totals: {
        subtotal: builder.subtotal.toFixed(2),
        tax: builder.tax.toFixed(2),
        total: builder.total.toFixed(2)
      },
      viewUrl: `https://app.pandadoc.com/a/#/documents/${document.id}`
    });
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create quote', 
      details: error.message 
    });
  }
});

// Create invoice (same as before)
app.post('/api/create-invoice', async (req, res) => {
  try {
    const { products, customerInfo, shippingAddress } = req.body;
    
    if (!customerInfo.email) {
      return res.status(400).json({ 
        error: 'Customer email required for branded merchandise images' 
      });
    }
    
    const fullCustomerInfo = {
      ...customerInfo,
      shippingAddress
    };
    
    const builder = new DocumentBuilder('invoice', fullCustomerInfo);
    
    for (const item of products) {
      builder.addProduct(item.productId, item.quantity);
    }

    const pandadoc = new PandaDocAPI(CONFIG.PANDADOC_API_KEY);
    const payload = builder.buildPandaDocPayload();
    const document = await pandadoc.createDocument(payload);

    // Wait for document to be ready then send
    const isReady = await pandadoc.waitForDocument(document.id);
    if (isReady) {
      try {
        await pandadoc.sendDocument(document.id);
      } catch (error) {
        console.error('Error sending document:', error);
      }
    }

    res.json({
      success: true,
      documentId: document.id,
      totals: {
        subtotal: builder.subtotal.toFixed(2),
        tax: builder.tax.toFixed(2),
        total: builder.total.toFixed(2)
      },
      viewUrl: `https://app.pandadoc.com/a/#/documents/${document.id}`
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create invoice', 
      details: error.message 
    });
  }
});

// Get document status
app.get('/api/document-status/:id', async (req, res) => {
  try {
    const pandadoc = new PandaDocAPI(CONFIG.PANDADOC_API_KEY);
    const status = await pandadoc.getDocumentStatus(req.params.id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get document status', 
      details: error.message 
    });
  }
});

// Start server
app.listen(CONFIG.PORT, () => {
  console.log(`PandaDoc Invoice System running on port ${CONFIG.PORT}`);
  console.log(`Access the interface at http://localhost:${CONFIG.PORT}`);
});