export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  code?: string;
  docUrl?: string;
}

export const questions: Question[] = [
  // ═══════════════════════════════════════════════════════
  // Section 1: MONGODB OVERVIEW AND THE DOCUMENT MODEL (8%)
  // ═══════════════════════════════════════════════════════
  {
    id: 1,
    topic: "Document Model",
    question: "Which of the following is NOT a valid BSON type in MongoDB?",
    options: ["ObjectId", "Decimal128", "DateTime", "Date"],
    correctIndex: 2,
    explanation: "BSON supports Date (not DateTime). Valid BSON types include Double, String, Object, Array, Binary, ObjectId, Boolean, Date, Null, Regex, Int32, Int64, Decimal128, and others. 'DateTime' is not a BSON type.",
    docUrl: "https://www.mongodb.com/docs/manual/reference/bson-types/"
  },
  {
    id: 2,
    topic: "Document Model",
    question: `Given these three documents:\n\nDocument A: { name: "Alice", age: 30 }\nDocument B: { name: "Bob", scores: [85, 90], active: true }\nDocument C: { title: "Manager", department: { name: "Engineering", floor: 3 } }\n\nCan all three documents co-exist in the same MongoDB collection?`,
    options: [
      "No, they have different fields",
      "No, documents in a collection must have the same shape",
      "Yes, MongoDB collections have a flexible schema by default",
      "Only if schema validation is disabled explicitly"
    ],
    correctIndex: 2,
    explanation: "MongoDB has a flexible (polymorphic) schema. Documents in the same collection do not need to have the same set of fields or structure. This is one of the fundamental features of the document model.",
    docUrl: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/"
  },
  {
    id: 3,
    topic: "Document Model",
    question: "Which BSON type should be used to store monetary values that require exact decimal representation?",
    options: ["Double", "Int64", "Decimal128", "String"],
    correctIndex: 2,
    explanation: "Decimal128 provides exact decimal representation, avoiding the rounding errors inherent in binary floating-point types like Double. It's the recommended type for financial and monetary data.",
    docUrl: "https://www.mongodb.com/docs/manual/reference/bson-types/#decimal128"
  },
  {
    id: 4,
    topic: "Document Model",
    question: `What is the BSON type of the _id field in the following document?\n\n{ _id: ObjectId("507f1f77bcf86cd799439011"), name: "Test" }`,
    options: ["String", "ObjectId", "Binary", "Int64"],
    correctIndex: 1,
    explanation: "ObjectId is a 12-byte BSON type used as the default _id value. It consists of a 4-byte timestamp, 5-byte random value, and 3-byte incrementing counter.",
    docUrl: "https://www.mongodb.com/docs/manual/reference/bson-types/#objectid"
  },

  // ═══════════════════════════════════════════════════════
  // Section 2: CRUD (51%)
  // ═══════════════════════════════════════════════════════

  // 2.1 Insert commands
  {
    id: 10,
    topic: "CRUD — Insert",
    question: `Which of the following is a properly formed insert command?\n\nA) db.orders.insertOne({ item: "widget", qty: 5 })\nB) db.orders.insertOne("item", "widget")\nC) db.orders.insert({ item: "widget" }, { ordered: true })\nD) db.orders.insertOne([{ item: "widget" }, { item: "gadget" }])`,
    options: [
      `db.orders.insertOne({ item: "widget", qty: 5 })`,
      `db.orders.insertOne("item", "widget")`,
      `db.orders.insert({ item: "widget" }, { ordered: true })`,
      `db.orders.insertOne([{ item: "widget" }, { item: "gadget" }])`
    ],
    correctIndex: 0,
    explanation: "insertOne() takes a single document object as its argument. Option B passes strings instead of a document. Option C uses the deprecated insert() method. Option D passes an array to insertOne() — use insertMany() for multiple documents.",
    code: `// Correct usage:\ndb.orders.insertOne({ item: "widget", qty: 5 })\n\n// For multiple documents:\ndb.orders.insertMany([\n  { item: "widget", qty: 5 },\n  { item: "gadget", qty: 3 }\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/"
  },
  {
    id: 11,
    topic: "CRUD — Insert",
    question: `You run the following command:\n\ndb.products.insertMany([\n  { _id: 1, name: "A" },\n  { _id: 1, name: "B" },\n  { _id: 2, name: "C" }\n])\n\nWhat happens with the default options?`,
    options: [
      "All three documents are inserted",
      "Only { _id: 1, name: 'A' } is inserted, then an error occurs and { _id: 2 } is NOT inserted",
      "The operation fails completely and no documents are inserted",
      "{ _id: 1, name: 'B' } overwrites { _id: 1, name: 'A' }"
    ],
    correctIndex: 1,
    explanation: "By default, insertMany() performs ordered inserts. It inserts the first document (_id: 1, name: 'A'), then encounters a duplicate key error on the second document. Because it's ordered, it stops and does NOT process the remaining documents. The third document is never inserted.",
    code: `// Default (ordered: true) — stops on error:\ndb.products.insertMany([\n  { _id: 1, name: "A" },\n  { _id: 1, name: "B" },  // duplicate key error\n  { _id: 2, name: "C" }   // never attempted\n])\n\n// With ordered: false — continues past errors:\ndb.products.insertMany([\n  { _id: 1, name: "A" },\n  { _id: 1, name: "B" },  // error, but continues\n  { _id: 2, name: "C" }   // inserted!\n], { ordered: false })`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/"
  },

  // 2.2 Update with replacement document
  {
    id: 12,
    topic: "CRUD — Update",
    question: `Given this document in the "users" collection:\n\n{ _id: 1, name: "Alice", age: 30, city: "NYC" }\n\nYou run:\ndb.users.replaceOne({ _id: 1 }, { name: "Alice", age: 31 })\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, name: "Alice", age: 31, city: "NYC" }',
      '{ _id: 1, name: "Alice", age: 31 }',
      '{ name: "Alice", age: 31 }',
      "An error because city field is missing"
    ],
    correctIndex: 1,
    explanation: "replaceOne() replaces the entire document except for the _id field. The city field is removed because it was not included in the replacement document. The _id is preserved automatically.",
    code: `// Setup:\ndb.users.insertOne({ _id: 1, name: "Alice", age: 30, city: "NYC" })\n\n// Replace:\ndb.users.replaceOne({ _id: 1 }, { name: "Alice", age: 31 })\n\n// Check result:\ndb.users.findOne({ _id: 1 })\n// { _id: 1, name: "Alice", age: 31 }  — city is gone!`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/"
  },

  // 2.3 $set
  {
    id: 13,
    topic: "CRUD — Update",
    question: `Given this document:\n\n{ _id: 1, name: "Alice", age: 30, city: "NYC" }\n\nYou run:\ndb.users.updateOne({ _id: 1 }, { $set: { age: 31, country: "US" } })\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, age: 31, country: "US" }',
      '{ _id: 1, name: "Alice", age: 31, city: "NYC", country: "US" }',
      '{ _id: 1, name: "Alice", age: 31, city: "NYC" }',
      "An error because country doesn't exist"
    ],
    correctIndex: 1,
    explanation: "$set only modifies the specified fields. It updates 'age' to 31 and adds the new field 'country' with value 'US'. All other existing fields (name, city) remain unchanged.",
    code: `// Setup:\ndb.users.insertOne({ _id: 1, name: "Alice", age: 30, city: "NYC" })\n\n// Update with $set:\ndb.users.updateOne({ _id: 1 }, { $set: { age: 31, country: "US" } })\n\n// Check:\ndb.users.findOne({ _id: 1 })\n// { _id: 1, name: "Alice", age: 31, city: "NYC", country: "US" }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/set/"
  },

  // 2.4 Upsert
  {
    id: 14,
    topic: "CRUD — Update",
    question: `You want to update a product's price, but if the product doesn't exist, you want it created. The product has sku: "ABC123". Which command should you use?`,
    options: [
      `db.products.updateOne({ sku: "ABC123" }, { $set: { price: 29.99 } })`,
      `db.products.updateOne({ sku: "ABC123" }, { $set: { price: 29.99 } }, { upsert: true })`,
      `db.products.insertOrUpdate({ sku: "ABC123" }, { price: 29.99 })`,
      `db.products.replaceOne({ sku: "ABC123" }, { price: 29.99 }, { insert: true })`
    ],
    correctIndex: 1,
    explanation: "Setting upsert: true in updateOne() will create a new document with the filter fields and update fields merged if no matching document is found.",
    code: `// If no document with sku "ABC123" exists, this creates:\n// { _id: ObjectId(...), sku: "ABC123", price: 29.99 }\n\ndb.products.updateOne(\n  { sku: "ABC123" },\n  { $set: { price: 29.99 } },\n  { upsert: true }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#std-label-updateOne-upsert"
  },

  // 2.5 updateMany
  {
    id: 15,
    topic: "CRUD — Update",
    question: `You need to add a field { status: "active" } to ALL documents in the "accounts" collection where the balance is greater than 0. Which is correct?`,
    options: [
      `db.accounts.updateOne({ balance: { $gt: 0 } }, { $set: { status: "active" } })`,
      `db.accounts.updateMany({ balance: { $gt: 0 } }, { $set: { status: "active" } })`,
      `db.accounts.updateAll({ balance: { $gt: 0 } }, { $set: { status: "active" } })`,
      `db.accounts.update({ balance: { $gt: 0 } }, { status: "active" }, { multi: true })`
    ],
    correctIndex: 1,
    explanation: "updateMany() updates all documents matching the filter. updateOne() only updates the first match. updateAll() doesn't exist. update() with multi is deprecated.",
    code: `// Update all matching documents:\ndb.accounts.updateMany(\n  { balance: { $gt: 0 } },\n  { $set: { status: "active" } }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/"
  },

  // 2.6 findAndModify concurrency
  {
    id: 16,
    topic: "CRUD — Update",
    question: `The "counters" collection has: { _id: "visits", count: 10 }\n\nTwo operations run concurrently:\nOperation A: db.counters.findOneAndUpdate({ _id: "visits" }, { $inc: { count: 1 } }, { returnDocument: "after" })\nOperation B: db.counters.findOneAndUpdate({ _id: "visits" }, { $inc: { count: 1 } }, { returnDocument: "after" })\n\nWhat are the possible return values?`,
    options: [
      "Both return { count: 11 }",
      "One returns { count: 11 } and the other returns { count: 12 }",
      "Both return { count: 12 }",
      "The second operation fails with a conflict error"
    ],
    correctIndex: 1,
    explanation: "findOneAndUpdate() is atomic at the document level. One operation acquires the lock first, increments to 11 and returns it. The second then increments from 11 to 12 and returns that. The operations are serialized at the document level.",
    code: `// Setup:\ndb.counters.insertOne({ _id: "visits", count: 10 })\n\n// Each findOneAndUpdate is atomic:\ndb.counters.findOneAndUpdate(\n  { _id: "visits" },\n  { $inc: { count: 1 } },\n  { returnDocument: "after" }\n)\n// Returns { _id: "visits", count: 11 }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/"
  },

  // 2.7 Delete
  {
    id: 17,
    topic: "CRUD — Delete",
    question: `You need to delete a single document from the "logs" collection where the level is "debug" and the timestamp is older than 2023-01-01. Which expression should you use?`,
    options: [
      `db.logs.deleteOne({ level: "debug", timestamp: { $lt: ISODate("2023-01-01") } })`,
      `db.logs.remove({ level: "debug", timestamp: { $lt: ISODate("2023-01-01") } })`,
      `db.logs.deleteMany({ level: "debug", timestamp: { $lt: ISODate("2023-01-01") } })`,
      `db.logs.drop({ level: "debug" })`
    ],
    correctIndex: 0,
    explanation: "deleteOne() deletes the first document matching the filter. remove() is deprecated. deleteMany() would delete ALL matching documents, not a single one. drop() drops the entire collection.",
    code: `// Delete one matching document:\ndb.logs.deleteOne({\n  level: "debug",\n  timestamp: { $lt: ISODate("2023-01-01") }\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/"
  },

  // 2.8 Simple equality find
  {
    id: 18,
    topic: "CRUD — Read",
    question: `Which expression finds a single document in the "employees" collection where the employee_id is exactly 12345?`,
    options: [
      `db.employees.findOne({ employee_id: 12345 })`,
      `db.employees.find({ employee_id: 12345 }).first()`,
      `db.employees.get({ employee_id: 12345 })`,
      `db.employees.search({ employee_id: 12345 })`
    ],
    correctIndex: 0,
    explanation: "findOne() returns a single document matching the query filter. find().first() is not a MongoDB method. get() and search() do not exist as collection methods.",
    code: `// Find one document by equality:\ndb.employees.findOne({ employee_id: 12345 })`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/"
  },

  // 2.9 Equality on array field
  {
    id: 19,
    topic: "CRUD — Read",
    question: `Given these documents in the "inventory" collection:\n\n{ _id: 1, tags: ["red", "blue"] }\n{ _id: 2, tags: ["blue", "green"] }\n{ _id: 3, tags: ["red", "green", "blue"] }\n{ _id: 4, tags: "red" }\n\nWhat does db.inventory.find({ tags: "red" }) return?`,
    options: [
      "Only _id: 4 (exact match on string)",
      "Documents _id: 1, _id: 3, _id: 4",
      "Documents _id: 1, _id: 3",
      "An error because tags has mixed types"
    ],
    correctIndex: 1,
    explanation: "When querying an array field with an equality match on a single value, MongoDB matches any document where the array contains that value OR where the field equals that value. So _id: 1 (tags contains 'red'), _id: 3 (tags contains 'red'), and _id: 4 (tags equals 'red') all match.",
    code: `// Setup:\ndb.inventory.insertMany([\n  { _id: 1, tags: ["red", "blue"] },\n  { _id: 2, tags: ["blue", "green"] },\n  { _id: 3, tags: ["red", "green", "blue"] },\n  { _id: 4, tags: "red" }\n])\n\n// This matches any doc where tags contains or equals "red":\ndb.inventory.find({ tags: "red" })\n// Returns _id: 1, 3, 4`,
    docUrl: "https://www.mongodb.com/docs/manual/tutorial/query-arrays/"
  },

  // 2.10 Relational operators
  {
    id: 20,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, score: 65 }\n{ _id: 2, score: 80 }\n{ _id: 3, score: 95 }\n{ _id: 4, score: 50 }\n\nWhat does db.scores.find({ score: { $gte: 65, $lt: 95 } }) return?`,
    options: [
      "Documents _id: 1 and _id: 2",
      "Documents _id: 1, _id: 2, and _id: 3",
      "Document _id: 2 only",
      "Documents _id: 2 and _id: 3"
    ],
    correctIndex: 0,
    explanation: "$gte: 65 matches scores >= 65, and $lt: 95 matches scores < 95. Score 65 matches (>= 65 and < 95). Score 80 matches. Score 95 does NOT match (not < 95). Score 50 does NOT match (not >= 65).",
    code: `// Setup:\ndb.scores.insertMany([\n  { _id: 1, score: 65 },\n  { _id: 2, score: 80 },\n  { _id: 3, score: 95 },\n  { _id: 4, score: 50 }\n])\n\ndb.scores.find({ score: { $gte: 65, $lt: 95 } })\n// Returns _id: 1 (65) and _id: 2 (80)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query-comparison/"
  },

  // 2.11 $in
  {
    id: 21,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, status: "active", type: "A" }\n{ _id: 2, status: "inactive", type: "B" }\n{ _id: 3, status: "pending", type: "A" }\n{ _id: 4, status: "active", type: "C" }\n\nWhat does db.items.find({ status: { $in: ["active", "pending"] } }) return?`,
    options: [
      "Documents _id: 1 and _id: 4 only",
      "Documents _id: 1, _id: 3, and _id: 4",
      "Document _id: 1 only",
      "All four documents"
    ],
    correctIndex: 1,
    explanation: "$in matches documents where the field value equals any value in the specified array. Documents with status 'active' (_id: 1, 4) and status 'pending' (_id: 3) all match.",
    code: `db.items.find({ status: { $in: ["active", "pending"] } })\n// Returns _id: 1, 3, 4`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/in/"
  },

  // 2.12 $elemMatch
  {
    id: 22,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, results: [{ product: "A", score: 82 }, { product: "B", score: 90 }] }\n{ _id: 2, results: [{ product: "A", score: 95 }, { product: "C", score: 70 }] }\n{ _id: 3, results: [{ product: "B", score: 68 }, { product: "A", score: 78 }] }\n\nWhat does this return?\ndb.survey.find({ results: { $elemMatch: { product: "A", score: { $gte: 90 } } } })`,
    options: [
      "Documents _id: 1 and _id: 2",
      "Document _id: 2 only",
      "Documents _id: 1, _id: 2, and _id: 3",
      "No documents"
    ],
    correctIndex: 1,
    explanation: "$elemMatch requires a SINGLE array element to match ALL conditions. Only _id: 2 has an element where product is 'A' AND score >= 90 in the same element ({ product: 'A', score: 95 }).",
    code: `// Setup:\ndb.survey.insertMany([\n  { _id: 1, results: [{ product: "A", score: 82 }, { product: "B", score: 90 }] },\n  { _id: 2, results: [{ product: "A", score: 95 }, { product: "C", score: 70 }] },\n  { _id: 3, results: [{ product: "B", score: 68 }, { product: "A", score: 78 }] }\n])\n\ndb.survey.find({\n  results: { $elemMatch: { product: "A", score: { $gte: 90 } } }\n})\n// Only _id: 2 matches`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/"
  },

  // 2.13 Logical operators
  {
    id: 23,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, type: "food", price: 5 }\n{ _id: 2, type: "drink", price: 3 }\n{ _id: 3, type: "food", price: 12 }\n{ _id: 4, type: "drink", price: 8 }\n\nWhat does this return?\ndb.items.find({ $or: [{ type: "food", price: { $gt: 10 } }, { type: "drink", price: { $lt: 5 } }] })`,
    options: [
      "Documents _id: 2, _id: 3",
      "Documents _id: 1, _id: 2, _id: 3",
      "Documents _id: 3, _id: 4",
      "Document _id: 3 only"
    ],
    correctIndex: 0,
    explanation: "$or matches documents satisfying at least one condition. First condition: type='food' AND price>10 → _id: 3. Second condition: type='drink' AND price<5 → _id: 2. Result: _id: 2 and _id: 3.",
    code: `db.items.find({\n  $or: [\n    { type: "food", price: { $gt: 10 } },\n    { type: "drink", price: { $lt: 5 } }\n  ]\n})\n// Returns _id: 2 and _id: 3`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/or/"
  },

  // 2.14 Sort and limit
  {
    id: 24,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, name: "A", score: 85 }\n{ _id: 2, name: "B", score: 92 }\n{ _id: 3, name: "C", score: 78 }\n{ _id: 4, name: "D", score: 95 }\n{ _id: 5, name: "E", score: 88 }\n\nWhat does db.students.find().sort({ score: -1 }).limit(3) return?`,
    options: [
      "D(95), B(92), E(88)",
      "C(78), A(85), E(88)",
      "A(85), B(92), C(78)",
      "D(95), B(92), A(85)"
    ],
    correctIndex: 0,
    explanation: "sort({ score: -1 }) sorts by score in descending order: 95, 92, 88, 85, 78. limit(3) takes the first 3: D(95), B(92), E(88).",
    code: `db.students.find().sort({ score: -1 }).limit(3)\n// Returns:\n// { _id: 4, name: "D", score: 95 }\n// { _id: 2, name: "B", score: 92 }\n// { _id: 5, name: "E", score: 88 }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/cursor.sort/"
  },

  // 2.15 Projections
  {
    id: 25,
    topic: "CRUD — Read",
    question: "Which of the following projections is INVALID?",
    options: [
      `{ name: 1, age: 1, _id: 0 }`,
      `{ name: 1, age: 0 }`,
      `{ password: 0, secret: 0 }`,
      `{ name: 1, email: 1 }`
    ],
    correctIndex: 1,
    explanation: "You cannot mix inclusion (1) and exclusion (0) in a projection, except for the _id field. { name: 1, age: 0 } mixes inclusion of 'name' with exclusion of 'age', which is invalid.",
    code: `// Valid inclusion (only these fields):\ndb.users.find({}, { name: 1, age: 1, _id: 0 })\n\n// Valid exclusion (all fields except these):\ndb.users.find({}, { password: 0, secret: 0 })\n\n// INVALID — cannot mix:\ndb.users.find({}, { name: 1, age: 0 })  // Error!`,
    docUrl: "https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/"
  },

  // 2.16 Cursor iteration
  {
    id: 26,
    topic: "CRUD — Read",
    question: "How do you get ALL results from a cursor returned by find()?",
    options: [
      "cursor.all()",
      "cursor.toArray()",
      "cursor.getAll()",
      "cursor.fetchAll()"
    ],
    correctIndex: 1,
    explanation: "toArray() returns an array containing all documents from the cursor. In mongosh, you can also iterate with forEach() or use the cursor directly.",
    code: `// Get all results as array:\nconst results = db.movies.find({ year: 2020 }).toArray()\n\n// Or iterate:\ndb.movies.find({ year: 2020 }).forEach(doc => {\n  print(doc.title)\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/cursor.toArray/"
  },

  // 2.17 Count documents
  {
    id: 27,
    topic: "CRUD — Read",
    question: "Which is the recommended way to count documents matching a query in modern MongoDB?",
    options: [
      "db.collection.count({ status: 'active' })",
      "db.collection.countDocuments({ status: 'active' })",
      "db.collection.find({ status: 'active' }).length",
      "db.collection.aggregate([{ $count: 'total' }])"
    ],
    correctIndex: 1,
    explanation: "countDocuments() is the recommended method. count() is deprecated. .length doesn't exist on cursors. While $count in aggregation works, countDocuments() is the standard approach for counting with a filter.",
    code: `// Recommended:\ndb.orders.countDocuments({ status: "active" })\n\n// Count all documents (no filter):\ndb.orders.estimatedDocumentCount()`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/"
  },

  // 2.20 $match + $group aggregation
  {
    id: 30,
    topic: "CRUD — Aggregation",
    question: `Given these documents in the "sales" collection:\n\n{ _id: 1, item: "apple", qty: 5, price: 1.0 }\n{ _id: 2, item: "banana", qty: 10, price: 0.5 }\n{ _id: 3, item: "apple", qty: 3, price: 1.0 }\n{ _id: 4, item: "banana", qty: 7, price: 0.5 }\n{ _id: 5, item: "cherry", qty: 2, price: 3.0 }\n\nWhat does this aggregation return?\ndb.sales.aggregate([\n  { $match: { qty: { $gte: 5 } } },\n  { $group: { _id: "$item", totalQty: { $sum: "$qty" } } }\n])`,
    options: [
      '[ { _id: "apple", totalQty: 8 }, { _id: "banana", totalQty: 17 } ]',
      '[ { _id: "apple", totalQty: 5 }, { _id: "banana", totalQty: 17 } ]',
      '[ { _id: "apple", totalQty: 5 }, { _id: "banana", totalQty: 10 }, { _id: "banana", totalQty: 7 } ]',
      '[ { _id: "apple", totalQty: 8 }, { _id: "banana", totalQty: 17 }, { _id: "cherry", totalQty: 2 } ]'
    ],
    correctIndex: 1,
    explanation: "$match filters to qty >= 5: _id: 1 (apple, 5), _id: 2 (banana, 10), _id: 4 (banana, 7). Then $group sums by item: apple=5, banana=10+7=17. Cherry and apple(qty:3) are filtered out.",
    code: `db.sales.aggregate([\n  { $match: { qty: { $gte: 5 } } },\n  { $group: { _id: "$item", totalQty: { $sum: "$qty" } } }\n])\n// apple: only qty=5 passes filter (qty=3 doesn't)\n// banana: 10 + 7 = 17`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/"
  },

  // 2.21 $lookup
  {
    id: 31,
    topic: "CRUD — Aggregation",
    question: `Given:\n\n"orders" collection: { _id: 1, product_id: "P1", qty: 2 }\n"products" collection: { _id: "P1", name: "Widget", price: 25.00 }\n\nWhat does this return?\ndb.orders.aggregate([\n  { $lookup: {\n    from: "products",\n    localField: "product_id",\n    foreignField: "_id",\n    as: "product_info"\n  }}\n])`,
    options: [
      '{ _id: 1, product_id: "P1", qty: 2, product_info: { name: "Widget", price: 25.00 } }',
      '{ _id: 1, product_id: "P1", qty: 2, product_info: [{ _id: "P1", name: "Widget", price: 25.00 }] }',
      '{ _id: 1, product_id: "P1", qty: 2, name: "Widget", price: 25.00 }',
      "An error because _id types don't match"
    ],
    correctIndex: 1,
    explanation: "$lookup always returns the joined documents as an ARRAY, even if there's only one match. The 'as' field specifies the name of the new array field added to the input documents.",
    code: `// $lookup always produces an array:\ndb.orders.aggregate([\n  { $lookup: {\n    from: "products",\n    localField: "product_id",\n    foreignField: "_id",\n    as: "product_info"\n  }}\n])\n// product_info is always an array!`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/"
  },

  // 2.22 $out
  {
    id: 32,
    topic: "CRUD — Aggregation",
    question: `What does the $out stage do in an aggregation pipeline?\n\ndb.orders.aggregate([\n  { $group: { _id: "$status", count: { $sum: 1 } } },\n  { $out: "order_summary" }\n])`,
    options: [
      "Appends the aggregation results to the 'order_summary' collection",
      "Replaces the 'order_summary' collection entirely with the aggregation results",
      "Creates a view called 'order_summary'",
      "Outputs results to the console and the collection"
    ],
    correctIndex: 1,
    explanation: "$out writes the results of the aggregation pipeline to a specified collection. If the collection exists, $out REPLACES the collection entirely. It must be the last stage in the pipeline.",
    code: `// $out replaces the target collection:\ndb.orders.aggregate([\n  { $group: { _id: "$status", count: { $sum: 1 } } },\n  { $out: "order_summary" }  // must be last stage\n])\n\n// Check the new collection:\ndb.order_summary.find()`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/"
  },

  // More CRUD - scenario-based
  {
    id: 33,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, name: "Alice", hobbies: ["reading", "gaming"] }\n\nYou run:\ndb.users.updateOne({ _id: 1 }, { $push: { hobbies: "cooking" }, $set: { name: "Alice W." } })\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, name: "Alice W.", hobbies: ["reading", "gaming", "cooking"] }',
      '{ _id: 1, name: "Alice W.", hobbies: ["cooking"] }',
      "An error — cannot use $push and $set together",
      '{ _id: 1, name: "Alice", hobbies: ["reading", "gaming", "cooking"] }'
    ],
    correctIndex: 0,
    explanation: "You can use multiple update operators in the same update document. $set updates the name field and $push appends 'cooking' to the hobbies array.",
    code: `db.users.updateOne(\n  { _id: 1 },\n  {\n    $push: { hobbies: "cooking" },\n    $set: { name: "Alice W." }\n  }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/push/"
  },

  {
    id: 34,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, name: "A", tags: ["x", "y"] }\n{ _id: 2, name: "B", tags: ["y", "z"] }\n{ _id: 3, name: "C", tags: ["x", "y", "z"] }\n\nWhat does db.items.find({ tags: ["y", "x"] }) return?`,
    options: [
      "Documents _id: 1 and _id: 3",
      "Document _id: 1 only",
      "No documents",
      "Documents _id: 1, _id: 2, and _id: 3"
    ],
    correctIndex: 2,
    explanation: "When querying with an exact array, MongoDB matches both the elements AND their order. ['y', 'x'] does not match ['x', 'y'] because the order differs. To match arrays containing those elements regardless of order, use $all.",
    code: `// Exact array match (order matters!):\ndb.items.find({ tags: ["y", "x"] })  // No match!\n\n// Match containing all elements (any order):\ndb.items.find({ tags: { $all: ["y", "x"] } })\n// Returns _id: 1 and _id: 3`,
    docUrl: "https://www.mongodb.com/docs/manual/tutorial/query-arrays/#match-an-array"
  },

  {
    id: 35,
    topic: "CRUD — Update",
    question: `What is the return value of this operation?\n\ndb.users.findOneAndUpdate(\n  { name: "Bob" },\n  { $inc: { loginCount: 1 } }\n)\n\nGiven: { _id: 2, name: "Bob", loginCount: 5 }`,
    options: [
      '{ _id: 2, name: "Bob", loginCount: 6 }',
      '{ _id: 2, name: "Bob", loginCount: 5 }',
      '{ acknowledged: true, modifiedCount: 1 }',
      "null"
    ],
    correctIndex: 1,
    explanation: "By default, findOneAndUpdate() returns the document BEFORE the modification. loginCount was 5 before the update, so it returns loginCount: 5. Use { returnDocument: 'after' } to get the updated document.",
    code: `// Default: returns ORIGINAL document\ndb.users.findOneAndUpdate(\n  { name: "Bob" },\n  { $inc: { loginCount: 1 } }\n)\n// Returns: { _id: 2, name: "Bob", loginCount: 5 }\n\n// To get the updated document:\ndb.users.findOneAndUpdate(\n  { name: "Bob" },\n  { $inc: { loginCount: 1 } },\n  { returnDocument: "after" }\n)\n// Returns: { _id: 2, name: "Bob", loginCount: 6 }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/"
  },

  {
    id: 36,
    topic: "CRUD — Read",
    question: `Given these documents in the "orders" collection:\n\n{ _id: 1, items: [{ name: "A", qty: 2 }, { name: "B", qty: 5 }] }\n{ _id: 2, items: [{ name: "A", qty: 10 }, { name: "C", qty: 1 }] }\n{ _id: 3, items: [{ name: "B", qty: 8 }, { name: "A", qty: 1 }] }\n\nWhich query finds orders where item "A" has qty > 5?`,
    options: [
      `db.orders.find({ "items.name": "A", "items.qty": { $gt: 5 } })`,
      `db.orders.find({ items: { $elemMatch: { name: "A", qty: { $gt: 5 } } } })`,
      `db.orders.find({ items: { name: "A", qty: { $gt: 5 } } })`,
      `db.orders.find({ "items.A.qty": { $gt: 5 } })`
    ],
    correctIndex: 1,
    explanation: "Without $elemMatch, MongoDB can satisfy conditions across different array elements. Option A would also match _id: 3 (has 'A' in one element and qty>5 in another). $elemMatch ensures both conditions are met by the SAME element. Only _id: 2 has an element where name='A' AND qty>5.",
    code: `// Without $elemMatch — may match across elements:\ndb.orders.find({ "items.name": "A", "items.qty": { $gt: 5 } })\n// Matches _id: 2 AND _id: 3 (B has qty 8!)\n\n// With $elemMatch — same element must match ALL:\ndb.orders.find({\n  items: { $elemMatch: { name: "A", qty: { $gt: 5 } } }\n})\n// Only matches _id: 2`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/"
  },

  {
    id: 37,
    topic: "CRUD — Read",
    question: `What does db.orders.find({ $and: [{ status: "shipped" }, { $or: [{ qty: { $gt: 100 } }, { priority: "high" }] }] }) match?`,
    options: [
      "Shipped orders with qty > 100 OR high priority (or both)",
      "All shipped orders plus any with qty > 100 or high priority",
      "Only shipped orders with both qty > 100 AND high priority",
      "This query syntax is invalid"
    ],
    correctIndex: 0,
    explanation: "The $and requires status='shipped'. Within that, the $or requires EITHER qty > 100 OR priority='high'. So the result is shipped orders that also have high qty or high priority.",
    code: `// Matches: shipped AND (qty > 100 OR priority = "high")\ndb.orders.find({\n  $and: [\n    { status: "shipped" },\n    { $or: [\n      { qty: { $gt: 100 } },\n      { priority: "high" }\n    ]}\n  ]\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/and/"
  },

  // ═══════════════════════════════════════════════════════
  // Section 3: INDEXES (17%)
  // ═══════════════════════════════════════════════════════

  {
    id: 40,
    topic: "Indexes",
    question: `A query db.orders.find({ customer_id: "C100" }).sort({ order_date: -1 }) is doing a COLLSCAN. Which index would best improve performance?`,
    options: [
      "db.orders.createIndex({ order_date: -1 })",
      "db.orders.createIndex({ customer_id: 1, order_date: -1 })",
      "db.orders.createIndex({ order_date: -1, customer_id: 1 })",
      "db.orders.createIndex({ customer_id: 1 })"
    ],
    correctIndex: 1,
    explanation: "The ESR rule: Equality first, then Sort. A compound index { customer_id: 1, order_date: -1 } supports both the equality match on customer_id and the sort on order_date. Putting order_date first would not efficiently filter by customer_id.",
    code: `// Best index for equality + sort:\ndb.orders.createIndex({ customer_id: 1, order_date: -1 })\n\n// Verify with explain:\ndb.orders.find({ customer_id: "C100" })\n  .sort({ order_date: -1 })\n  .explain("executionStats")`,
    docUrl: "https://www.mongodb.com/docs/manual/tutorial/sort-results-with-indexes/"
  },

  {
    id: 41,
    topic: "Indexes",
    question: `The query db.products.find({ tags: "electronics" }) is doing a COLLSCAN. The "tags" field is an array. Which index should you create?`,
    options: [
      "db.products.createIndex({ tags: 'text' })",
      "db.products.createIndex({ tags: 1 })",
      "db.products.createIndex({ tags: 'array' })",
      "db.products.createIndex({ tags: 'multikey' })"
    ],
    correctIndex: 1,
    explanation: "Creating a standard index on an array field automatically creates a multikey index. You don't specify 'multikey' or 'array' — MongoDB detects the array and handles it. A text index is for full-text search, not equality matching.",
    code: `// Standard index on array field = automatic multikey:\ndb.products.createIndex({ tags: 1 })\n\n// MongoDB automatically creates a multikey index\n// Verify:\ndb.products.find({ tags: "electronics" }).explain()`,
    docUrl: "https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/"
  },

  {
    id: 42,
    topic: "Indexes",
    question: `A query db.events.find({}).sort({ date: 1, priority: -1 }) is doing a COLLSCAN. Which index improves performance?`,
    options: [
      "db.events.createIndex({ date: 1 })",
      "db.events.createIndex({ priority: -1, date: 1 })",
      "db.events.createIndex({ date: 1, priority: -1 })",
      "db.events.createIndex({ date: -1, priority: 1 })"
    ],
    correctIndex: 2,
    explanation: "For a sort on multiple fields, the index must match the sort order exactly. The query sorts by { date: 1, priority: -1 }, so the index must be { date: 1, priority: -1 }. Reversing the field order or sort directions won't help.",
    code: `// Index must match sort order:\ndb.events.createIndex({ date: 1, priority: -1 })\n\n// Note: { date: -1, priority: 1 } also works\n// (complete reversal is equivalent)`,
    docUrl: "https://www.mongodb.com/docs/manual/tutorial/sort-results-with-indexes/"
  },

  {
    id: 43,
    topic: "Indexes",
    question: `You run db.products.getIndexes() and get:\n[\n  { v: 2, key: { _id: 1 }, name: "_id_" },\n  { v: 2, key: { category: 1 }, name: "category_1" },\n  { v: 2, key: { price: 1, category: 1 }, name: "price_1_category_1" }\n]\n\nHow many indexes exist on this collection?`,
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
    explanation: "There are 3 indexes: the default _id index, a single-field index on category, and a compound index on price + category. The _id index always counts as an index.",
    code: `// List all indexes:\ndb.products.getIndexes()\n// Returns array of index specifications`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.getIndexes/"
  },

  {
    id: 44,
    topic: "Indexes",
    question: "What is a trade-off of having too many indexes on a collection?",
    options: [
      "Read queries become slower",
      "Write operations (insert, update, delete) become slower because each index must be updated",
      "The collection becomes read-only",
      "MongoDB automatically removes unused indexes"
    ],
    correctIndex: 1,
    explanation: "Each index must be updated on every write operation (insert, update, delete). More indexes mean slower writes and more storage. However, reads that use the index become faster. It's a trade-off between read and write performance.",
    docUrl: "https://www.mongodb.com/docs/manual/core/data-model-operations/#indexes"
  },

  {
    id: 45,
    topic: "Indexes",
    question: `You run a query with explain() and see this in the output:\n\n{ "stage": "COLLSCAN", "nReturned": 5, "totalDocsExamined": 100000 }\n\nWhat does this indicate?`,
    options: [
      "The query is using an index efficiently",
      "The query is scanning the entire collection — no index is being used",
      "The query returned 100,000 documents",
      "The index is corrupted"
    ],
    correctIndex: 1,
    explanation: "COLLSCAN means a collection scan — MongoDB examined all 100,000 documents to return just 5. This is a performance issue. An IXSCAN (index scan) would indicate an index is being used.",
    code: `// Check for COLLSCAN:\ndb.orders.find({ status: "active" }).explain("executionStats")\n\n// Look for:\n// "stage": "IXSCAN"  → good, using index\n// "stage": "COLLSCAN" → bad, scanning all docs`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/explain-results/"
  },

  // ═══════════════════════════════════════════════════════
  // Section 4: DATA MODELING (4%)
  // ═══════════════════════════════════════════════════════

  {
    id: 50,
    topic: "Data Modeling",
    question: `You have three collections:\n- "authors" (parent)\n- "books" (child of authors)\n- "reviews" (child of books)\n\nEach author has 5-10 books. Each book can have thousands of reviews. Which relationships should be embedded vs. linked?`,
    options: [
      "Embed both books and reviews in authors",
      "Embed books in authors, link reviews separately",
      "Link everything separately",
      "Embed reviews in books, link books to authors"
    ],
    correctIndex: 1,
    explanation: "Books (5-10 per author) are a good candidate for embedding — bounded, small count, accessed together. Reviews (thousands per book) should be linked to avoid exceeding the 16MB document limit and because they grow unboundedly.",
    docUrl: "https://www.mongodb.com/docs/manual/core/data-model-design/"
  },

  {
    id: 51,
    topic: "Data Modeling",
    question: "Which of the following is considered a data modeling anti-pattern in MongoDB?",
    options: [
      "Embedding frequently accessed sub-documents",
      "Storing unbounded arrays that grow without limit in a document",
      "Using references for large related datasets",
      "Denormalizing data for read-heavy workloads"
    ],
    correctIndex: 1,
    explanation: "Unbounded arrays (arrays that grow without limit) are a major anti-pattern. They can cause the document to exceed the 16MB BSON limit and degrade performance as the array grows.",
    docUrl: "https://www.mongodb.com/docs/manual/data-modeling/"
  },

  {
    id: 52,
    topic: "Data Modeling",
    question: "When is the maximum BSON document size of 16 MB most likely to be a concern?",
    options: [
      "When storing a single user profile with 10 fields",
      "When embedding an unbounded array of comments inside a blog post document",
      "When using references between collections",
      "When creating compound indexes"
    ],
    correctIndex: 1,
    explanation: "The 16 MB limit becomes a concern when embedding arrays that can grow unboundedly, such as comments on a popular blog post. This is why unbounded arrays should be stored in a separate collection with references.",
    docUrl: "https://www.mongodb.com/docs/manual/reference/limits/#bson-document-size"
  },

  // ═══════════════════════════════════════════════════════
  // Section 5: TOOLS AND TOOLING (2%)
  // ═══════════════════════════════════════════════════════

  {
    id: 55,
    topic: "Tools",
    question: "In MongoDB Atlas, where can you browse and query documents in a collection without using mongosh or a driver?",
    options: [
      "Atlas CLI",
      "Data Explorer in the Atlas UI",
      "MongoDB Compass only",
      "The aggregation builder only"
    ],
    correctIndex: 1,
    explanation: "The Data Explorer in the Atlas web UI allows you to browse collections, view documents, run queries, and manage indexes directly in the browser without additional tools.",
    docUrl: "https://www.mongodb.com/docs/atlas/atlas-ui/documents/"
  },

  // ═══════════════════════════════════════════════════════
  // Section 6: DRIVERS (18%)
  // ═══════════════════════════════════════════════════════

  {
    id: 60,
    topic: "Drivers",
    question: "What is a MongoDB driver?",
    options: [
      "A GUI tool for managing MongoDB",
      "A library that allows an application to interact with MongoDB in a specific programming language",
      "A command-line tool for database administration",
      "A plugin for mongosh"
    ],
    correctIndex: 1,
    explanation: "A MongoDB driver is a client library for a specific programming language (Node.js, Python, Java, etc.) that provides an API for applications to connect to and interact with MongoDB.",
    docUrl: "https://www.mongodb.com/docs/drivers/"
  },

  {
    id: 61,
    topic: "Drivers",
    question: "Which components make up a MongoDB connection URI string?",
    options: [
      "mongodb://username:password@host:port/database",
      "mongodb://host/database/collection",
      "mongo://user@host",
      "db://host:port"
    ],
    correctIndex: 0,
    explanation: "A standard MongoDB connection URI includes the protocol (mongodb:// or mongodb+srv://), credentials (username:password), host(s), port, and optionally a default database and options.",
    code: `// Standard URI format:\n"mongodb://username:password@host:port/database?options"\n\n// Atlas SRV format:\n"mongodb+srv://username:password@cluster.mongodb.net/database"\n\n// Node.js example:\nconst { MongoClient } = require('mongodb');\nconst client = new MongoClient(uri);`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/connection-string/"
  },

  {
    id: 62,
    topic: "Drivers",
    question: "What is connection pooling in MongoDB drivers?",
    options: [
      "Creating a new connection for each database operation",
      "Maintaining a cache of reusable database connections to reduce overhead",
      "Connecting to multiple databases simultaneously",
      "A failover mechanism for replica sets"
    ],
    correctIndex: 1,
    explanation: "Connection pooling maintains a set of open connections that can be reused across multiple operations. This avoids the overhead of opening/closing connections for each operation, improving performance significantly.",
    docUrl: "https://www.mongodb.com/docs/manual/administration/connection-pool-overview/"
  },

  {
    id: 63,
    topic: "Drivers — Node.js",
    question: "Which is the correct Node.js driver syntax to insert one document?",
    options: [
      `await db.collection("users").insertOne({ name: "Alice" })`,
      `await db.collection("users").add({ name: "Alice" })`,
      `await db.collection("users").insert({ name: "Alice" })`,
      `await db.collection("users").create({ name: "Alice" })`
    ],
    correctIndex: 0,
    explanation: "The Node.js driver uses insertOne() for single documents and insertMany() for multiple documents. add(), insert() (deprecated), and create() are not standard driver methods.",
    code: `const { MongoClient } = require('mongodb');\nconst client = new MongoClient(uri);\n\nasync function run() {\n  const db = client.db("mydb");\n  \n  // Insert one:\n  const result = await db.collection("users")\n    .insertOne({ name: "Alice", age: 30 });\n  console.log(result.insertedId);\n  \n  // Insert many:\n  const results = await db.collection("users")\n    .insertMany([\n      { name: "Bob" },\n      { name: "Charlie" }\n    ]);\n}`,
    docUrl: "https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/"
  },

  {
    id: 64,
    topic: "Drivers — Node.js",
    question: "Which is the correct Node.js driver syntax to update many documents?",
    options: [
      `await collection.updateAll({ active: true }, { $set: { verified: true } })`,
      `await collection.updateMany({ active: true }, { $set: { verified: true } })`,
      `await collection.update({ active: true }, { $set: { verified: true } }, { multi: true })`,
      `await collection.modifyMany({ active: true }, { verified: true })`
    ],
    correctIndex: 1,
    explanation: "The Node.js driver uses updateMany() with a filter and update document, same as mongosh. updateAll() and modifyMany() don't exist. update() with multi is deprecated.",
    code: `// Update many in Node.js:\nconst result = await db.collection("users")\n  .updateMany(\n    { active: true },\n    { $set: { verified: true } }\n  );\nconsole.log(result.modifiedCount);`,
    docUrl: "https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateMany/"
  },

  {
    id: 65,
    topic: "Drivers — Node.js",
    question: "Which is the correct Node.js driver syntax to delete one document?",
    options: [
      `await collection.deleteOne({ _id: new ObjectId("...") })`,
      `await collection.remove({ _id: new ObjectId("...") })`,
      `await collection.destroy({ _id: new ObjectId("...") })`,
      `await collection.drop({ _id: new ObjectId("...") })`
    ],
    correctIndex: 0,
    explanation: "The Node.js driver uses deleteOne() for single deletes and deleteMany() for multiple. remove() is deprecated, destroy() doesn't exist, and drop() drops the entire collection.",
    code: `// Delete one:\nconst result = await db.collection("users")\n  .deleteOne({ _id: new ObjectId("507f1f77bcf86cd799439011") });\n\n// Delete many:\nconst result2 = await db.collection("logs")\n  .deleteMany({ level: "debug" });`,
    docUrl: "https://www.mongodb.com/docs/drivers/node/current/usage-examples/deleteOne/"
  },

  {
    id: 66,
    topic: "Drivers — Node.js",
    question: "Which is the correct Node.js driver syntax to find one document and find many documents?",
    options: [
      `findOne() returns a document; find() returns a cursor`,
      `findOne() returns a cursor; find() returns an array`,
      `get() returns a document; getAll() returns an array`,
      `findOne() and find() both return arrays`
    ],
    correctIndex: 0,
    explanation: "In the Node.js driver, findOne() returns a single document (or null). find() returns a FindCursor that you can iterate over with .toArray(), .forEach(), or async iteration.",
    code: `// Find one — returns document or null:\nconst user = await db.collection("users")\n  .findOne({ email: "alice@example.com" });\n\n// Find many — returns cursor:\nconst cursor = db.collection("users")\n  .find({ active: true });\n\n// Convert cursor to array:\nconst users = await cursor.toArray();\n\n// Or iterate:\nfor await (const doc of cursor) {\n  console.log(doc);\n}`,
    docUrl: "https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/"
  },

  // ═══════════════════════════════════════════════════════
  // Additional scenario-based questions
  // ═══════════════════════════════════════════════════════

  {
    id: 70,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, scores: [60, 75, 80] }\n\nYou run:\ndb.students.updateOne({ _id: 1 }, { $pull: { scores: { $lt: 70 } } })\n\nWhat is the resulting document?`,
    options: [
      "{ _id: 1, scores: [75, 80] }",
      "{ _id: 1, scores: [60, 80] }",
      "{ _id: 1, scores: [80] }",
      "{ _id: 1, scores: [60, 75] }"
    ],
    correctIndex: 0,
    explanation: "$pull removes all elements from the array that match the condition. $lt: 70 removes 60 (the only value < 70), leaving [75, 80].",
    code: `// $pull removes matching array elements:\ndb.students.updateOne(\n  { _id: 1 },\n  { $pull: { scores: { $lt: 70 } } }\n)\n// Removes 60, result: [75, 80]`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/pull/"
  },

  {
    id: 71,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, qty: 10, status: "available" }\n\nYou run:\ndb.products.updateOne(\n  { _id: 1 },\n  { $inc: { qty: -3 }, $set: { lastSold: new Date() } }\n)\n\nWhat is the value of qty after the update?`,
    options: ["13", "7", "10", "-3"],
    correctIndex: 1,
    explanation: "$inc increments the field by the given amount. $inc: { qty: -3 } decrements qty by 3: 10 + (-3) = 7.",
    code: `// $inc with negative value decrements:\ndb.products.updateOne(\n  { _id: 1 },\n  { $inc: { qty: -3 } }\n)\n// qty: 10 → 7`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/inc/"
  },

  {
    id: 72,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, a: 5, b: 10 }\n{ _id: 2, a: 15, b: 3 }\n{ _id: 3, a: 8, b: 8 }\n{ _id: 4, a: 20, b: 1 }\n\nWhat does db.test.find({ $nor: [{ a: { $gt: 10 } }, { b: { $gt: 5 } }] }) return?`,
    options: [
      "Documents _id: 1 and _id: 3",
      "Document _id: 3 only",
      "No documents",
      "All documents"
    ],
    correctIndex: 2,
    explanation: "$nor returns documents that fail ALL conditions. _id: 1 (a:5 ≤10 ✓, but b:10 >5 ✗ — b fails $nor). _id: 2 (a:15 >10 ✗). _id: 3 (a:8 ≤10 ✓, but b:8 >5 ✗). _id: 4 (a:20 >10 ✗). No document passes both exclusions.",
    code: `// $nor: document must NOT match ANY condition\ndb.test.find({\n  $nor: [\n    { a: { $gt: 10 } },\n    { b: { $gt: 5 } }\n  ]\n})\n// Needs: a <= 10 AND b <= 5\n// No document satisfies both!`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/nor/"
  },

  {
    id: 73,
    topic: "CRUD — Aggregation",
    question: `Given "orders":\n\n{ _id: 1, customer: "A", items: ["x", "y"] }\n{ _id: 2, customer: "B", items: ["y", "z", "w"] }\n\nWhat does this aggregation produce?\ndb.orders.aggregate([\n  { $project: { customer: 1, numItems: { $size: "$items" } } }\n])`,
    options: [
      '[ { _id: 1, customer: "A", numItems: 2 }, { _id: 2, customer: "B", numItems: 3 } ]',
      '[ { customer: "A", numItems: 2 }, { customer: "B", numItems: 3 } ]',
      '[ { _id: 1, numItems: 2 }, { _id: 2, numItems: 3 } ]',
      "An error — $size only works in queries"
    ],
    correctIndex: 0,
    explanation: "$size in an aggregation expression returns the number of elements in an array. _id is included by default in $project unless explicitly excluded.",
    code: `db.orders.aggregate([\n  { $project: {\n    customer: 1,\n    numItems: { $size: "$items" }\n  }}\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/size/"
  },

  {
    id: 74,
    topic: "CRUD — Insert",
    question: `What happens when you run this command?\n\ndb.users.insertOne({ _id: "custom-id-123", name: "Test" })`,
    options: [
      "An error — _id must be an ObjectId",
      "The document is inserted with _id set to 'custom-id-123' (a string)",
      "MongoDB ignores the _id and generates an ObjectId",
      "The document is inserted but _id is converted to ObjectId"
    ],
    correctIndex: 1,
    explanation: "You can provide a custom _id of any BSON type (string, number, etc.), as long as it's unique within the collection. MongoDB does not require _id to be an ObjectId — it just defaults to one if you don't provide an _id.",
    code: `// Custom _id values are perfectly valid:\ndb.users.insertOne({ _id: "custom-id-123", name: "Test" })\ndb.users.insertOne({ _id: 42, name: "Numeric ID" })\ndb.users.insertOne({ _id: { region: "US", seq: 1 }, name: "Compound ID" })`,
    docUrl: "https://www.mongodb.com/docs/manual/core/document/#the-_id-field"
  },

  {
    id: 75,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, name: "Alice", address: { city: "NYC", zip: "10001" } }\n\nYou run:\ndb.users.updateOne({ _id: 1 }, { $set: { "address.city": "LA" } })\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, name: "Alice", address: { city: "LA" } }',
      '{ _id: 1, name: "Alice", address: { city: "LA", zip: "10001" } }',
      '{ _id: 1, name: "Alice", address: "LA" }',
      "An error — cannot use dot notation with $set"
    ],
    correctIndex: 1,
    explanation: "$set with dot notation ('address.city') updates only the nested field, preserving all other fields in the embedded document. The zip field is untouched.",
    code: `// Dot notation updates nested fields precisely:\ndb.users.updateOne(\n  { _id: 1 },\n  { $set: { "address.city": "LA" } }\n)\n// Only city changes, zip stays`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/set/"
  },

  {
    id: 76,
    topic: "CRUD — Read",
    question: `Given:\n\n{ _id: 1, x: 5 }\n{ _id: 2, x: null }\n{ _id: 3, y: 10 }\n\nWhat does db.test.find({ x: { $exists: true } }) return?`,
    options: [
      "Only _id: 1",
      "Documents _id: 1 and _id: 2",
      "Documents _id: 1 and _id: 3",
      "All three documents"
    ],
    correctIndex: 1,
    explanation: "$exists: true matches documents where the field exists, even if the value is null. _id: 1 has x: 5 (exists), _id: 2 has x: null (exists!), _id: 3 has no x field (doesn't exist).",
    code: `db.test.find({ x: { $exists: true } })\n// Returns _id: 1 and _id: 2\n// null values still "exist"!\n\n// To find non-null values:\ndb.test.find({ x: { $exists: true, $ne: null } })`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/exists/"
  },

  {
    id: 77,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, tags: ["a", "b", "a", "c"] }\n\nYou run:\ndb.test.updateOne({ _id: 1 }, { $addToSet: { tags: "a" } })\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, tags: ["a", "b", "a", "c", "a"] }',
      '{ _id: 1, tags: ["a", "b", "a", "c"] }',
      '{ _id: 1, tags: ["a", "b", "c"] }',
      '{ _id: 1, tags: ["b", "c", "a"] }'
    ],
    correctIndex: 1,
    explanation: "$addToSet only adds a value if it doesn't already exist in the array. Since 'a' is already present, the array remains unchanged. Note: $addToSet does NOT remove existing duplicates.",
    code: `// $addToSet won't add duplicates:\ndb.test.updateOne(\n  { _id: 1 },\n  { $addToSet: { tags: "a" } }\n)\n// "a" already exists, no change\n\n// But it WOULD add "d":\ndb.test.updateOne(\n  { _id: 1 },\n  { $addToSet: { tags: "d" } }\n)\n// tags: ["a", "b", "a", "c", "d"]`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/"
  },

  {
    id: 78,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, name: "Test", count: 0 }\n\nYou run:\ndb.test.updateOne({ _id: 1 }, { $unset: { count: "" } })\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, name: "Test", count: "" }',
      '{ _id: 1, name: "Test" }',
      '{ _id: 1, name: "Test", count: null }',
      "An error"
    ],
    correctIndex: 1,
    explanation: "$unset removes the field entirely from the document. The value you pass to $unset ('' in this case) doesn't matter — it just removes the field.",
    code: `// $unset removes the field:\ndb.test.updateOne(\n  { _id: 1 },\n  { $unset: { count: "" } }  // value doesn't matter\n)\n// Result: { _id: 1, name: "Test" }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/unset/"
  },

  {
    id: 79,
    topic: "Indexes",
    question: `You have a compound index { a: 1, b: 1, c: 1 }. Which of the following queries can this index support?`,
    options: [
      "db.col.find({ b: 5 })",
      "db.col.find({ a: 1, c: 3 })",
      "db.col.find({ c: 3, b: 2 })",
      "db.col.find({ a: 1, b: 2 })"
    ],
    correctIndex: 3,
    explanation: "Compound indexes follow the prefix rule. Index { a, b, c } supports queries on: { a }, { a, b }, or { a, b, c }. Query { a: 1, b: 2 } uses the prefix { a, b }. Queries on { b }, { c, b }, or { a, c } (skipping b) cannot fully use this index.",
    code: `// Index: { a: 1, b: 1, c: 1 }\n// Supports (uses index prefix):\ndb.col.find({ a: 1 })           // prefix: a\ndb.col.find({ a: 1, b: 2 })     // prefix: a, b\ndb.col.find({ a: 1, b: 2, c: 3 }) // full index\n\n// Does NOT fully support:\ndb.col.find({ b: 5 })      // missing prefix 'a'\ndb.col.find({ a: 1, c: 3 }) // skips 'b'`,
    docUrl: "https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/#prefixes"
  },

  {
    id: 80,
    topic: "CRUD — Aggregation",
    question: `Given "employees" collection:\n\n{ _id: 1, name: "A", dept: "eng", salary: 80000 }\n{ _id: 2, name: "B", dept: "eng", salary: 90000 }\n{ _id: 3, name: "C", dept: "sales", salary: 70000 }\n{ _id: 4, name: "D", dept: "sales", salary: 75000 }\n\nWhat does this return?\ndb.employees.aggregate([\n  { $group: { _id: "$dept", maxSalary: { $max: "$salary" }, count: { $sum: 1 } } },\n  { $sort: { maxSalary: -1 } }\n])`,
    options: [
      '[ { _id: "eng", maxSalary: 90000, count: 2 }, { _id: "sales", maxSalary: 75000, count: 2 } ]',
      '[ { _id: "sales", maxSalary: 75000, count: 2 }, { _id: "eng", maxSalary: 90000, count: 2 } ]',
      '[ { _id: "eng", maxSalary: 170000, count: 2 } ]',
      '[ { _id: "eng", maxSalary: 90000, count: 1 }, { _id: "sales", maxSalary: 75000, count: 1 } ]'
    ],
    correctIndex: 0,
    explanation: "$group groups by dept: eng (max 90000, count 2), sales (max 75000, count 2). $sort by maxSalary descending puts eng first.",
    code: `db.employees.aggregate([\n  { $group: {\n    _id: "$dept",\n    maxSalary: { $max: "$salary" },\n    count: { $sum: 1 }\n  }},\n  { $sort: { maxSalary: -1 } }\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/"
  },

  {
    id: 81,
    topic: "CRUD — Read",
    question: `What is the correct syntax for creating an Atlas Search index?`,
    options: [
      `db.collection.createIndex({ "$**": "text" })`,
      `db.collection.createSearchIndex({ name: "default", definition: { mappings: { dynamic: true } } })`,
      `db.collection.createIndex({ type: "search" })`,
      `db.collection.addSearchIndex("default")`
    ],
    correctIndex: 1,
    explanation: "createSearchIndex() is used to create Atlas Search indexes. It takes a name and definition with mappings. This is different from regular indexes created with createIndex().",
    code: `// Create Atlas Search index:\ndb.movies.createSearchIndex({\n  name: "default",\n  definition: {\n    mappings: {\n      dynamic: true\n    }\n  }\n})`,
    docUrl: "https://www.mongodb.com/docs/atlas/atlas-search/create-index/"
  },

  {
    id: 82,
    topic: "CRUD — Read",
    question: `Which is the correct way to perform an Atlas Search query?`,
    options: [
      `db.movies.find({ $text: { $search: "matrix" } })`,
      `db.movies.aggregate([{ $search: { text: { query: "matrix", path: "title" } } }])`,
      `db.movies.search({ query: "matrix" })`,
      `db.movies.find({ $search: "matrix" })`
    ],
    correctIndex: 1,
    explanation: "Atlas Search uses the $search stage in an aggregation pipeline, not the $text operator. The $search stage must be the first stage in the pipeline.",
    code: `// Atlas Search query:\ndb.movies.aggregate([\n  { $search: {\n    text: {\n      query: "matrix",\n      path: "title"\n    }\n  }},\n  { $limit: 10 }\n])`,
    docUrl: "https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/"
  },

  {
    id: 83,
    topic: "Document Model",
    question: `Which of the following values is NOT a valid BSON type?`,
    options: [
      "An array of mixed types: [1, 'hello', true]",
      "A nested document: { address: { city: 'NYC' } }",
      "undefined",
      "Binary data"
    ],
    correctIndex: 2,
    explanation: "The 'undefined' type is deprecated in BSON and should not be used. While JavaScript has undefined, BSON does not support it as a valid type. Use null instead. Arrays of mixed types and nested documents are perfectly valid.",
    docUrl: "https://www.mongodb.com/docs/manual/reference/bson-types/"
  },

  {
    id: 84,
    topic: "CRUD — Update",
    question: `Given: { _id: 1, items: [{ id: "a", qty: 5 }, { id: "b", qty: 3 }] }\n\nYou run:\ndb.orders.updateOne(\n  { _id: 1, "items.id": "b" },\n  { $set: { "items.$.qty": 10 } }\n)\n\nWhat is the resulting document?`,
    options: [
      '{ _id: 1, items: [{ id: "a", qty: 10 }, { id: "b", qty: 10 }] }',
      '{ _id: 1, items: [{ id: "a", qty: 5 }, { id: "b", qty: 10 }] }',
      '{ _id: 1, items: [{ id: "a", qty: 5 }, { id: "b", qty: 3 }], qty: 10 }',
      "An error — positional operator is invalid"
    ],
    correctIndex: 1,
    explanation: "The positional operator ($) identifies the array element matched by the query condition ('items.id': 'b'). It updates only that matched element's qty to 10.",
    code: `// $ positional operator updates matched element:\ndb.orders.updateOne(\n  { _id: 1, "items.id": "b" },\n  { $set: { "items.$.qty": 10 } }\n)\n// Only the element with id "b" is updated`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/positional/"
  },

  {
    id: 85,
    topic: "Drivers — Node.js",
    question: `In the Node.js driver, what does this code return?\n\nconst result = await collection.insertOne({ name: "Alice" });\nconsole.log(result.insertedId);`,
    options: [
      "The entire inserted document",
      "The ObjectId of the inserted document",
      "A boolean (true/false)",
      "The count of inserted documents"
    ],
    correctIndex: 1,
    explanation: "insertOne() returns an InsertOneResult object. The insertedId property contains the _id of the newly inserted document (an ObjectId if none was specified).",
    code: `const result = await collection.insertOne({ name: "Alice" });\nconsole.log(result.acknowledged); // true\nconsole.log(result.insertedId);   // ObjectId("...")`,
    docUrl: "https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/"
  },

  {
    id: 86,
    topic: "CRUD — Delete",
    question: `Given:\n{ _id: 1, status: "inactive", lastLogin: ISODate("2020-01-01") }\n{ _id: 2, status: "active", lastLogin: ISODate("2024-01-01") }\n{ _id: 3, status: "inactive", lastLogin: ISODate("2019-06-15") }\n\nYou run: db.users.deleteMany({ status: "inactive" })\n\nHow many documents are deleted?`,
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
    explanation: "deleteMany() deletes ALL documents matching the filter. Two documents have status 'inactive' (_id: 1 and _id: 3), so both are deleted.",
    code: `db.users.deleteMany({ status: "inactive" })\n// Deletes _id: 1 and _id: 3\n// Returns: { acknowledged: true, deletedCount: 2 }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/"
  },

  {
    id: 87,
    topic: "CRUD — Aggregation",
    question: `Given "orders":\n{ _id: 1, items: ["apple", "banana"] }\n{ _id: 2, items: ["cherry"] }\n\nWhat does this produce?\ndb.orders.aggregate([\n  { $unwind: "$items" }\n])`,
    options: [
      '2 documents unchanged',
      '3 documents: { _id: 1, items: "apple" }, { _id: 1, items: "banana" }, { _id: 2, items: "cherry" }',
      '1 document with all items combined',
      'An error — $unwind requires an object'
    ],
    correctIndex: 1,
    explanation: "$unwind deconstructs the array, creating one output document per array element. _id: 1 has 2 items → 2 documents. _id: 2 has 1 item → 1 document. Total: 3 documents.",
    code: `db.orders.aggregate([{ $unwind: "$items" }])\n// Output:\n// { _id: 1, items: "apple" }\n// { _id: 1, items: "banana" }\n// { _id: 2, items: "cherry" }`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/"
  },

  {
    id: 88,
    topic: "Drivers",
    question: `What does mongodb+srv:// in a connection string indicate?`,
    options: [
      "A connection to a local MongoDB instance",
      "A secure connection using DNS SRV records for automatic host discovery",
      "A connection using SSL only",
      "A connection to MongoDB version 5+"
    ],
    correctIndex: 1,
    explanation: "mongodb+srv:// uses DNS SRV records to automatically discover all members of a replica set or sharded cluster. It also implies TLS/SSL. This is the standard format for Atlas connection strings.",
    code: `// SRV connection (typical Atlas):\nconst uri = "mongodb+srv://user:pass@cluster0.abc123.mongodb.net/mydb";\n\n// Equivalent standard URI might be:\n// "mongodb://user:pass@host1:27017,host2:27017,host3:27017/mydb?ssl=true&replicaSet=..."`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/connection-string/#dns-seed-list-connection-format"
  },

  {
    id: 89,
    topic: "CRUD — Read",
    question: `Given these documents:\n\n{ _id: 1, name: "A", score: 80, grade: "B" }\n{ _id: 2, name: "B", score: 90, grade: "A" }\n{ _id: 3, name: "C", score: 80, grade: "B" }\n\nWhat does db.students.find().sort({ score: -1, name: 1 }).limit(2) return?`,
    options: [
      "B(90), then A(80)",
      "B(90), then C(80)",
      "A(80), then B(90)",
      "B(90), then A(80) and C(80)"
    ],
    correctIndex: 0,
    explanation: "Sort by score descending: B(90) first, then A(80) and C(80) tie. For ties, sort by name ascending: A comes before C. Limit 2 gives: B(90), A(80).",
    code: `db.students.find()\n  .sort({ score: -1, name: 1 })\n  .limit(2)\n// 1st: B (score 90)\n// 2nd: A (score 80, name "A" < "C")`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/cursor.sort/"
  },

  {
    id: 90,
    topic: "CRUD — Update",
    question: `What does $rename do?\n\ndb.users.updateMany({}, { $rename: { "fname": "firstName" } })`,
    options: [
      "Renames the collection",
      "Renames the field 'fname' to 'firstName' in all matching documents",
      "Creates a copy of the field with the new name",
      "Renames the database"
    ],
    correctIndex: 1,
    explanation: "$rename renames a field. It effectively does a $unset of the old name and a $set of the new name. If the old field doesn't exist in a document, that document is unchanged.",
    code: `// Rename field:\ndb.users.updateMany(\n  {},\n  { $rename: { "fname": "firstName" } }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/rename/"
  },
];

export function getRandomQuestion(excludeIds: number[] = []): Question {
  const available = questions.filter(q => !excludeIds.includes(q.id));
  const pool = available.length > 0 ? available : questions;
  return pool[Math.floor(Math.random() * pool.length)];
}
