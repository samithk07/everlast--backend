const z = require("zod");

const serviceValidator = z.object({
  fullName: z.string().trim().min(3),
  phone: z.string().trim().min(10).max(10),
  email: z.string().email(),
  address: z.string().trim().min(5),
  serviceType: z.enum([
    "Installation",
    "Repair",
    "Maintenance",
    "Filter Replacement",
  ]),
  preferredDate: z.string().optional(),
  description: z.string().trim().optional(),
});

module.exports = serviceValidator;