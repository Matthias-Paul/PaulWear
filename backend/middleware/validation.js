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

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 }).withMessage("Discount price must be a positive number"),

  body("countInStock")
    .notEmpty().withMessage("Count in stock is required")
    .isInt({ min: 0 }).withMessage("Count in stock must be a non-negative integer"),

  body("sku")
    .notEmpty().withMessage("SKU is required"),

  body("category")
    .notEmpty().withMessage("Category is required"),

  body("brand")
    .optional().isString().withMessage("Brand must be a string"),

  body("sizes")
    .isArray({ min: 1 }).withMessage("At least one size is required"),

  body("colors")
    .isArray({ min: 1 }).withMessage("At least one color is required"),

  body("collections")
    .notEmpty().withMessage("Collection is required"),

  body("material")
    .notEmpty().withMessage("Material is required"),

  body("gender")
    .optional()
    .isIn(["Men", "Women", "Unisex"]).withMessage("Gender must be one of: Men, Women, Unisex"),

  body("images")
    .isArray({ min: 1 }).withMessage("At least one image is required"),

  body("images.*.url")
    .notEmpty().withMessage("Image URL is required"),

  body("isFeatured")
    .optional().isBoolean(),

  body("isPublished")
    .optional().isBoolean(),

  body("rating")
    .optional().isFloat({ min: 0, max: 5 }),

  body("numReviews")
    .optional().isInt({ min: 0 }),

  body("tags")
    .optional().isArray(),

  body("metaTitle").optional().isString(),
  body("metaDescription").optional().isString(),
  body("metaKeywords").optional().isString(),

  body("dimensions.length").optional().isNumeric(),
  body("dimensions.width").optional().isNumeric(),
  body("dimensions.height").optional().isNumeric(),

  body("weight").optional().isNumeric()
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
    .notEmpty().withMessage("Color is required.")
    .isString().withMessage("Color must be a string."),

  body("size")
    .notEmpty().withMessage("Size is required.")
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

  body("shippingAddress.address")
    .notEmpty()
    .withMessage("Shipping address is required"),

  body("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required"),

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

