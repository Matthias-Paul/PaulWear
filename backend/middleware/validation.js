import { body } from "express-validator";

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
    .notEmpty().withMessage("Product name is required.")
    .isString().withMessage("Product name must be a string."),

  body("image")
    .optional()
    .isURL().withMessage("Invalid image URL."),

  body("price")
    .notEmpty().withMessage("Price is required.")
    .isNumeric().withMessage("Price must be a number."),

  body("color")
    .notEmpty().withMessage("Color is required.")
    .isString().withMessage("Color must be a string."),

  body("size")
    .notEmpty().withMessage("Size is required.")
    .isString().withMessage("Size must be a string."),

  body("quantity")
    .notEmpty().withMessage("Quantity is required.")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

]