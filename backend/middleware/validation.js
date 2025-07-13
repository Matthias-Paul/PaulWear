import { body, param } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["customer", "admin", "vendor"])
    .withMessage("Invalid Role")
];

export const loginValidation = [
  

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

 
];



export const validateProduct = [
  body("name")
    .notEmpty()    
    .withMessage("Product name is required")
    .isString().withMessage("Name must be a string")
    .trim(),

  body("description")
    .notEmpty().withMessage("Description is required"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),


  body("category")
    .isIn(["Fashion And Apparel", "Hair And Beauty Products", "Bags And Accessories", "Baked Goods And Snacks", "Electronics And Gadgets", "Foodstuff And Provisions", "Health and Personal Care Products", "Others"])
    .withMessage("Invalid  category")
    .notEmpty().withMessage("Category is required"),

  body("sizes")
    .optional()
    .isArray({ min: 1 }).withMessage("At least one size is required"),
  
  body("colors")
    .optional()
    .isArray({ min: 1 }).withMessage("At least one color is required"),
 
  body("gender")
    .optional()
    .isIn(["Men", "Women", "Unisex"]).withMessage("Gender must be one of: Men, Women, Unisex"),
       
  body("images")
    .isArray({ min: 3 }).withMessage("At least three images is required"),

  body("images.*.url")  
    .notEmpty().withMessage("Image URL is required"),
  
  body("isFeatured")  
    .optional().isBoolean(),

    body("randomSortKey")  
    .optional(),
   
  body("isPublished")
    .optional().isBoolean(),

  body("rating")
    .optional().isFloat({ min: 0, max: 5 }),

  body("numReviews")
    .optional().isInt({ min: 0 }),

];


export const validateCartItem = [
  body("productId")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID."),

  body("name")
    .optional()
    .isString().withMessage("Product name must be a string."),

    body("guestId")
    .optional()
    .isString().withMessage("Guest ID must be a string."),

    body("userId")
    .optional()
    .isString().withMessage("User ID must be a string."),

  body("image")
    .optional()
    .isURL().withMessage("Invalid image URL."),

  body("price")
    .optional()
    .isNumeric().withMessage("Price must be a number."),

  body("color")
    .notEmpty().withMessage("Please select a color before adding to cart.")
    .isString().withMessage("Color must be a string."),

  body("size")
    .notEmpty().withMessage("Please select a size before adding to cart.")
    .isString().withMessage("Size must be a string."),
   
  body("quantity")
    .notEmpty().withMessage("Quantity is required.")
    .isInt({ min: 1 }).withMessage("Quantity must not be less than 1."),
           
]

export const validateEditCartItem = [
  body("productId")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID."),

  body("name")
    .optional()
    .isString().withMessage("Product name must be a string."),

    body("guestId")
    .optional()
    .isString().withMessage("Guest ID must be a string."),

    body("userId")
    .optional()
    .isString().withMessage("User ID must be a string."),

  body("image")
    .optional()
    .isURL().withMessage("Invalid image URL."),

  body("price")
    .optional()
    .isNumeric().withMessage("Price must be a number."),

  body("color")
    .notEmpty().withMessage("Color is required.")
    .isString().withMessage("Color must be a string."),

  body("size")
    .notEmpty().withMessage("Size is required.")
    .isString().withMessage("Size must be a string."),
   
  body("quantity")
    .notEmpty().withMessage("Quantity is required.")
    .isInt({ min: 0 }).withMessage("Quantity must not be less than 0."),
           
]

export const validateDeleteCartItem = [

param("productId")
    .notEmpty().withMessage("Product ID is required.")
    .isMongoId().withMessage("Invalid Product ID."),

  body("name")
    .optional()
    .isString().withMessage("Product name must be a string."),

    body("guestId")
    .optional()
    .isString().withMessage("Guest ID must be a string."),

    body("userId")
    .optional()
    .isString().withMessage("User ID must be a string."),

  body("image")
    .optional()
    .isURL().withMessage("Invalid image URL."),

  body("price")
    .optional()
    .isNumeric().withMessage("Price must be a number."),

  body("color")
    .notEmpty().withMessage("Color is required.")
    .isString().withMessage("Color must be a string."),
  
  body("size")
    .notEmpty().withMessage("Size is required.")
    .isString().withMessage("Size must be a string."),
   
           
]


export const validateCheckout = [
  body("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("checkoutItems")
    .isArray({ min: 1 })
    .withMessage("No items in checkout, at least one item is required"),

  body("checkoutItems.*.productId")
    .isMongoId()
    .withMessage("Each productId must be a valid Mongo ID"),

  body("checkoutItems.*.name")
    .notEmpty()
    .withMessage("Each item must have a name"),

  body("checkoutItems.*.image")
    .notEmpty()
    .withMessage("Each item must have an image"),

  body("checkoutItems.*.price")
    .isNumeric()
    .withMessage("Each item must have a valid price"),

  body("checkoutItems.*.quantity") 
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required"),

  body("totalPrice")
    .isNumeric()
    .withMessage("Total price must be a number"),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed"])
    .withMessage("Invalid payment status"),
];


export const validateSubscriber = [
  body("email")      
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail()
];


export const editVendorOrderValidation = [
  param("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isMongoId()
    .withMessage("Invalid Order ID."),

  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid  status")
    .isString()
    .withMessage("Status must be a string."),
]


export const validateVendor = [

  body('storeName')
    .trim()
    .notEmpty().withMessage('Store name is required')
    .isLength({ min: 3 }).withMessage('Store name must be at least 3 characters'),

  body('storeLogo')
    .notEmpty().withMessage('Store logo is required')
    .isURL().withMessage('Store logo must be a valid URL'),

  body('businessCertificate')
    .optional()
    .isURL().withMessage('Business certificate must be a valid URL'),

  body('bio')
  .notEmpty().withMessage('bio is required')
  .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),

  body('contactNumber')
    .notEmpty().withMessage('Contact number is required')
    .isMobilePhone().withMessage('Invalid contact number'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .toLowerCase(),
    

  body('address')
    .notEmpty().withMessage('Address is required'),

  body('state')
    .notEmpty().withMessage('State is required'),

  body('campus')
    .notEmpty().withMessage('Campus is required'),

  body('kycDocs')
    .optional()
    .isArray().withMessage('KYC docs must be an array')
    .custom((arr) => arr.every(item => /^https?:\/\/.+/.test(item)))
    .withMessage('KYC docs must contain valid URLs'),
];



export const validateVendorAccount = [
  body("accountNumber")
    .trim()
    .notEmpty().withMessage("Bank account number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Bank account number must be 10 digits"),

  body("bankCode")
    .trim()
    .notEmpty().withMessage("Bank code is required")
    .isLength({ min: 3 }).withMessage("Bank code is invalid"),

  body("userBankName")
    .notEmpty().withMessage("Account name is required")
    .isString().withMessage("Account name must be a string"),
  
    body("bankName")
    .notEmpty().withMessage("Bank name is required")
    .isString().withMessage("Bank name must be a string"),
];

