const z = require("zod");

const productValidate = z.object({
   
  name: z
    .string()
    .trim()
    .min(4, "Product name must be at least 4 characters"),

  category: z.enum(
    ["ro", "uv", "uf", "gravity", "accessories"],
    {
      errorMap: () => ({
        message: "Invalid product category",
      }),
    }
  ),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  brand: z
    .string()
    .trim()
    .optional()
    .default("Everlast"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  originalPrice: z.coerce
    .number()
    .positive("Original price must be greater than 0"),

  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .optional()
    .default(0),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  rating: z.coerce
    .number()
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot exceed 5")
    .optional()
    .default(0),

  reviews: z.coerce
    .number()
    .int("Reviews must be an integer")
    .nonnegative()
    .optional()
    .default(0),

  warranty: z
    .string()
    .trim()
    .optional()
    .default("1 Year"),


  status: z
    .enum(["active", "inactive"])
    .optional()
    .default("active"),

features: z
  .union([
    z.string().trim(),
    z.array(z.string().trim())
  ])
  .transform((value) => Array.isArray(value) ? value : [value]),
});

module.exports = productValidate;