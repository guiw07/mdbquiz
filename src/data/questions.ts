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
  {
    id: 1,
    topic: "CRUD Operations",
    question: "Which method is used to insert a single document into a MongoDB collection?",
    options: ["db.collection.add()", "db.collection.insertOne()", "db.collection.create()", "db.collection.push()"],
    correctIndex: 1,
    explanation: "insertOne() inserts a single document into a collection and returns an InsertOneResult.",
    code: `// Try it in mongosh:\ndb.movies.insertOne({\n  title: "The Matrix",\n  year: 1999,\n  genre: "Sci-Fi"\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/"
  },
  {
    id: 2,
    topic: "CRUD Operations",
    question: "What does the `$set` operator do in an update operation?",
    options: [
      "Replaces the entire document",
      "Sets the value of a field in a document",
      "Creates a new collection",
      "Deletes a field from a document"
    ],
    correctIndex: 1,
    explanation: "$set replaces the value of a field with the specified value. If the field does not exist, $set will add a new field with the specified value.",
    code: `// Update a document:\ndb.movies.updateOne(\n  { title: "The Matrix" },\n  { $set: { rating: 8.7 } }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/set/"
  },
  {
    id: 3,
    topic: "Aggregation",
    question: "Which aggregation stage is used to filter documents?",
    options: ["$project", "$match", "$group", "$sort"],
    correctIndex: 1,
    explanation: "$match filters documents to pass only those that match the specified conditions to the next pipeline stage.",
    code: `// Aggregation with $match:\ndb.movies.aggregate([\n  { $match: { year: { $gte: 2000 } } },\n  { $project: { title: 1, year: 1 } }\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/"
  },
  {
    id: 4,
    topic: "Indexes",
    question: "What type of index does MongoDB create by default on every collection?",
    options: ["Compound index on all fields", "Text index", "Unique index on the _id field", "Geospatial index"],
    correctIndex: 2,
    explanation: "MongoDB creates a unique index on the _id field during the creation of a collection. This index prevents clients from inserting two documents with the same _id value.",
    docUrl: "https://www.mongodb.com/docs/manual/indexes/#default-_id-index"
  },
  {
    id: 5,
    topic: "CRUD Operations",
    question: "Which method returns a cursor to the documents that match the query criteria?",
    options: ["db.collection.findOne()", "db.collection.find()", "db.collection.get()", "db.collection.query()"],
    correctIndex: 1,
    explanation: "find() selects documents in a collection and returns a cursor to the selected documents.",
    code: `// Find documents:\ndb.movies.find(\n  { genre: "Sci-Fi" },\n  { title: 1, year: 1, _id: 0 }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.find/"
  },
  {
    id: 6,
    topic: "Aggregation",
    question: "What does the `$group` stage do in an aggregation pipeline?",
    options: [
      "Sorts documents by a field",
      "Groups input documents by a specified _id expression and applies accumulator expressions",
      "Limits the number of documents",
      "Joins two collections"
    ],
    correctIndex: 1,
    explanation: "$group groups documents by a specified expression and outputs one document for each distinct grouping. Accumulators like $sum, $avg, $max can be applied.",
    code: `// Group movies by genre and count:\ndb.movies.aggregate([\n  { $group: {\n    _id: "$genre",\n    count: { $sum: 1 },\n    avgRating: { $avg: "$rating" }\n  }}\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/"
  },
  {
    id: 7,
    topic: "Data Modeling",
    question: "When should you use embedding over referencing in MongoDB?",
    options: [
      "When the related data is very large and accessed independently",
      "When you have a one-to-many relationship with frequently accessed related data",
      "When you need to normalize your data",
      "When the related data changes frequently and independently"
    ],
    correctIndex: 1,
    explanation: "Embedding is ideal for one-to-many relationships where the related data is frequently accessed together and doesn't change independently.",
    docUrl: "https://www.mongodb.com/docs/manual/core/data-model-design/"
  },
  {
    id: 8,
    topic: "CRUD Operations",
    question: "What does `deleteMany({})` do?",
    options: [
      "Deletes the collection",
      "Deletes all documents in the collection",
      "Throws an error",
      "Deletes the database"
    ],
    correctIndex: 1,
    explanation: "deleteMany({}) with an empty filter deletes all documents in the collection but keeps the collection and its indexes.",
    code: `// Delete all documents:\ndb.movies.deleteMany({})\n\n// Delete with filter:\ndb.movies.deleteMany({ year: { $lt: 1990 } })`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/"
  },
  {
    id: 9,
    topic: "Indexes",
    question: "What is a compound index?",
    options: [
      "An index that only stores unique values",
      "An index on a single field",
      "An index on multiple fields",
      "An index for text search"
    ],
    correctIndex: 2,
    explanation: "A compound index is an index on multiple fields. The order of fields in a compound index matters for query optimization.",
    code: `// Create a compound index:\ndb.movies.createIndex(\n  { genre: 1, year: -1 }\n)\n\n// This index supports queries on:\n// - genre alone\n// - genre AND year\n// But NOT year alone`,
    docUrl: "https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/"
  },
  {
    id: 10,
    topic: "Aggregation",
    question: "Which operator is used to reshape documents in an aggregation pipeline by including, excluding, or adding new fields?",
    options: ["$match", "$unwind", "$project", "$lookup"],
    correctIndex: 2,
    explanation: "$project passes along the documents with the requested fields to the next stage. It can include, exclude, or add new computed fields.",
    code: `// Project specific fields:\ndb.movies.aggregate([\n  { $project: {\n    title: 1,\n    yearStr: { $toString: "$year" },\n    _id: 0\n  }}\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/"
  },
  {
    id: 11,
    topic: "CRUD Operations",
    question: "What does the `$push` operator do?",
    options: [
      "Pushes a document to a new collection",
      "Appends a value to an array field",
      "Sorts an array",
      "Removes the last element of an array"
    ],
    correctIndex: 1,
    explanation: "$push appends a specified value to an array. If the field is absent, $push adds the array field with the value as its element.",
    code: `// Push to an array:\ndb.movies.updateOne(\n  { title: "The Matrix" },\n  { $push: { tags: "classic" } }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/update/push/"
  },
  {
    id: 12,
    topic: "Aggregation",
    question: "What does the `$lookup` stage do?",
    options: [
      "Searches for text matches",
      "Performs a left outer join to another collection",
      "Groups documents",
      "Filters documents"
    ],
    correctIndex: 1,
    explanation: "$lookup performs a left outer join to another collection in the same database to filter in documents from the joined collection for processing.",
    code: `// Join orders with products:\ndb.orders.aggregate([\n  { $lookup: {\n    from: "products",\n    localField: "productId",\n    foreignField: "_id",\n    as: "productDetails"\n  }}\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/"
  },
  {
    id: 13,
    topic: "CRUD Operations",
    question: "What is the difference between `replaceOne()` and `updateOne()`?",
    options: [
      "There is no difference",
      "replaceOne() replaces the entire document; updateOne() modifies specific fields",
      "updateOne() replaces the entire document; replaceOne() modifies specific fields",
      "replaceOne() can only be used with $set"
    ],
    correctIndex: 1,
    explanation: "replaceOne() replaces the entire document (except _id), while updateOne() uses update operators like $set to modify specific fields.",
    code: `// replaceOne replaces everything:\ndb.movies.replaceOne(\n  { title: "The Matrix" },\n  { title: "The Matrix", year: 1999, rating: 9.0 }\n)\n\n// updateOne modifies fields:\ndb.movies.updateOne(\n  { title: "The Matrix" },\n  { $set: { rating: 9.0 } }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/"
  },
  {
    id: 14,
    topic: "Indexes",
    question: "What is the purpose of the `explain()` method?",
    options: [
      "To display collection statistics",
      "To show the query execution plan and performance details",
      "To create an index",
      "To validate documents"
    ],
    correctIndex: 1,
    explanation: "explain() returns information on the query plan, including whether an index was used, how many documents were examined, and execution time.",
    code: `// Check if your query uses an index:\ndb.movies.find(\n  { genre: "Sci-Fi" }\n).explain("executionStats")`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/cursor.explain/"
  },
  {
    id: 15,
    topic: "Data Modeling",
    question: "What is the maximum BSON document size in MongoDB?",
    options: ["4 MB", "8 MB", "16 MB", "32 MB"],
    correctIndex: 2,
    explanation: "The maximum BSON document size is 16 megabytes. For larger files, use GridFS.",
    docUrl: "https://www.mongodb.com/docs/manual/reference/limits/#bson-document-size"
  },
  {
    id: 16,
    topic: "CRUD Operations",
    question: "Which query operator matches values that are greater than or equal to a specified value?",
    options: ["$gt", "$gte", "$ge", "$gteq"],
    correctIndex: 1,
    explanation: "$gte selects documents where the value of the field is greater than or equal to the specified value.",
    code: `// Find movies from 2000 onwards:\ndb.movies.find(\n  { year: { $gte: 2000 } }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/gte/"
  },
  {
    id: 17,
    topic: "Aggregation",
    question: "What does `$unwind` do in an aggregation pipeline?",
    options: [
      "Combines arrays from multiple documents",
      "Deconstructs an array field to output a document for each element",
      "Sorts documents",
      "Removes duplicate documents"
    ],
    correctIndex: 1,
    explanation: "$unwind deconstructs an array field from the input documents to output a document for each element of the array.",
    code: `// Unwind tags array:\ndb.movies.aggregate([\n  { $unwind: "$tags" },\n  { $group: {\n    _id: "$tags",\n    count: { $sum: 1 }\n  }}\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/"
  },
  {
    id: 18,
    topic: "CRUD Operations",
    question: "What does the `$in` operator do?",
    options: [
      "Checks if a field exists in the document",
      "Matches any of the values specified in an array",
      "Inserts a value into an array",
      "Checks if a value is inside a nested document"
    ],
    correctIndex: 1,
    explanation: "$in selects documents where the value of a field equals any value in the specified array.",
    code: `// Find specific genres:\ndb.movies.find({\n  genre: { $in: ["Sci-Fi", "Action", "Thriller"] }\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/in/"
  },
  {
    id: 19,
    topic: "Indexes",
    question: "What is a multikey index used for?",
    options: [
      "Indexing multiple collections at once",
      "Indexing the content of arrays",
      "Creating multiple indexes in one command",
      "Indexing compound fields only"
    ],
    correctIndex: 1,
    explanation: "MongoDB automatically creates a multikey index if any indexed field is an array. The index contains an entry for each element of the array.",
    docUrl: "https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/"
  },
  {
    id: 20,
    topic: "Transactions",
    question: "Which method is used to start a session for multi-document transactions?",
    options: [
      "db.startTransaction()",
      "client.startSession()",
      "db.beginTransaction()",
      "client.createTransaction()"
    ],
    correctIndex: 1,
    explanation: "You must start a session using client.startSession() before you can run a multi-document transaction.",
    code: `// Multi-document transaction:\nconst session = client.startSession()\nsession.startTransaction()\n\ntry {\n  await db.accounts.updateOne(\n    { name: "Alice" },\n    { $inc: { balance: -100 } },\n    { session }\n  )\n  await db.accounts.updateOne(\n    { name: "Bob" },\n    { $inc: { balance: 100 } },\n    { session }\n  )\n  await session.commitTransaction()\n} catch (e) {\n  await session.abortTransaction()\n} finally {\n  session.endSession()\n}`,
    docUrl: "https://www.mongodb.com/docs/manual/core/transactions/"
  },
  {
    id: 21,
    topic: "CRUD Operations",
    question: "What is the purpose of the `upsert` option in update operations?",
    options: [
      "Updates all matching documents",
      "Creates a new document if no document matches the filter",
      "Deletes the document if it exists",
      "Updates only the first matching document"
    ],
    correctIndex: 1,
    explanation: "When upsert: true, if no document matches the filter, MongoDB inserts a new document based on the filter and update criteria.",
    code: `// Upsert example:\ndb.movies.updateOne(\n  { title: "Inception" },\n  { $set: { year: 2010, rating: 8.8 } },\n  { upsert: true }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#std-label-updateOne-upsert"
  },
  {
    id: 22,
    topic: "Aggregation",
    question: "Which accumulator returns the average value of numeric values in a $group stage?",
    options: ["$sum", "$avg", "$mean", "$average"],
    correctIndex: 1,
    explanation: "$avg returns the average value of numeric values. It ignores non-numeric values.",
    code: `// Average rating per genre:\ndb.movies.aggregate([\n  { $group: {\n    _id: "$genre",\n    avgRating: { $avg: "$rating" }\n  }}\n])`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/avg/"
  },
  {
    id: 23,
    topic: "CRUD Operations",
    question: "What does `findOneAndUpdate()` return by default?",
    options: [
      "The updated document",
      "The original document before the update",
      "A count of modified documents",
      "A boolean indicating success"
    ],
    correctIndex: 1,
    explanation: "By default, findOneAndUpdate() returns the original document before the modification. Use returnDocument: 'after' to get the updated version.",
    code: `// Return original (default):\ndb.movies.findOneAndUpdate(\n  { title: "The Matrix" },\n  { $set: { rating: 9.5 } }\n)\n\n// Return updated:\ndb.movies.findOneAndUpdate(\n  { title: "The Matrix" },\n  { $set: { rating: 9.5 } },\n  { returnDocument: "after" }\n)`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/"
  },
  {
    id: 24,
    topic: "Data Modeling",
    question: "Which MongoDB feature allows you to enforce a schema on a collection?",
    options: [
      "Strict mode",
      "Schema validation with $jsonSchema",
      "Mongoose only",
      "Collection constraints"
    ],
    correctIndex: 1,
    explanation: "MongoDB supports JSON Schema validation using the $jsonSchema operator in the validator option when creating or modifying a collection.",
    code: `// Add schema validation:\ndb.createCollection("movies", {\n  validator: {\n    $jsonSchema: {\n      bsonType: "object",\n      required: ["title", "year"],\n      properties: {\n        title: { bsonType: "string" },\n        year: { bsonType: "int", minimum: 1888 }\n      }\n    }\n  }\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/core/schema-validation/"
  },
  {
    id: 25,
    topic: "CRUD Operations",
    question: "What does the `$regex` operator do?",
    options: [
      "Validates document schema",
      "Provides regular expression pattern matching for strings",
      "Replaces string values",
      "Counts string occurrences"
    ],
    correctIndex: 1,
    explanation: "$regex provides regular expression capabilities for pattern matching strings in queries.",
    code: `// Find movies starting with "The":\ndb.movies.find({\n  title: { $regex: /^The/, $options: "i" }\n})`,
    docUrl: "https://www.mongodb.com/docs/manual/reference/operator/query/regex/"
  },
];

export function getRandomQuestion(excludeIds: number[] = []): Question {
  const available = questions.filter(q => !excludeIds.includes(q.id));
  const pool = available.length > 0 ? available : questions;
  return pool[Math.floor(Math.random() * pool.length)];
}
