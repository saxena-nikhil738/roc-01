import { faker } from "@faker-js/faker";
import db from "../index.js";

export const GenerateFackData = async (req, res) => {
  const products = [];
  const generateProductsArray = (num) => {
    // Generate unique products
    for (let i = 0; i < num; i++) {
      products.push({
        itemid: i + 1, // Unique ID (starting from 1)
        itemname: faker.commerce.productName(), // Generate a random product name
      });
    }
  };

  const productsArray = generateProductsArray(1);

  try {
    // Insert products into the table
    const insertQuery = "INSERT INTO items (itemid, itemname) VALUES (?, ?)";
    for (const product of products) {
      db.query(insertQuery, [product.itemid, product.itemname]);
    }

    console.log("Data inserted successfully.");
    res
      .status(200)
      .json({ success: true, message: "Data inserted successfully." });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ success: false, message: "Error inserting data." });
  }
};
