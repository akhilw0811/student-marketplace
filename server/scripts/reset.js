import { writeFileSync } from "fs";
const seed = {
  users: [{ id:"seed-admin", email:"admin@ufl.edu", name:"Admin", role:"admin", verified:true }],
  listings: [
    { id:"l1", title:"COP3530 Textbook", price:45, category:"Textbooks", description:"Lightly used.", imageUrl:"https://placehold.co/400x300?text=Textbook", status:"active", ownerId:"seed-admin", createdAt:1700000000000 }
  ]
};
writeFileSync("./db.json", JSON.stringify(seed, null, 2));
console.log("DB reset.");


