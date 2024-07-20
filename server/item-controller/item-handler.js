import db from "../index.js";

export const SaveSelection = async (req, res) => {
  const { email, selectedItems } = req.body;

  try {
    // Delete existing selections for the user
    await db
      .promise()
      .query("DELETE FROM user_selections WHERE email = ?", [email]);

    // Insert new selections
    const insertValues = selectedItems.map((itemid) => [email, itemid]);
    if (insertValues.length > 0) {
      await db
        .promise()
        .query("INSERT INTO user_selections (email, itemid) VALUES ?", [
          insertValues,
        ]);
    }

    res.status(200).send({ success: true, message: "Selections saved" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

export const UserSelection = async (req, res) => {
  const { email } = req.query;

  try {
    const [selections] = await db
      .promise()
      .query("SELECT itemid FROM user_selections WHERE email = ?", [email]);
    const selectedItems = selections.map((selection) => selection.itemid);
    res.status(200).send({ success: true, selectedItems });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

export const FetchItem = async (req, res) => {
  const getQuery = "SELECT * FROM items";

  try {
    const [rows] = await db.promise().query(getQuery); // Use promise() for async/await compatibility
    res.status(200).json({ success: true, data: rows });
    // res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};
