const z=require("zod");

const registerValidator=z.object({
    name:z.string().min(4),
    email:z.string().email(),
    password:z.string().min(5)
});

module.exports=registerValidator;