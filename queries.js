// Switch to the correct database
use plp_bookstore;

// 📦 Task 2: Basic CRUD Operations

// Find all books in a specific genre (e.g., "Fiction")
db.books.find({ genre: "Fiction" });

// Find books published after a certain year (e.g., 1950)
db.books.find({ published_year: { $gt: 1950 } });

// Find books by a specific author (e.g., "George Orwell")
db.books.find({ author: "George Orwell" });

// Update the price of a specific book (e.g., change "1984" to 12.99)
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 12.99 } }
);

// Delete a book by its title (e.g., "Moby Dick")
db.books.deleteOne({ title: "Moby Dick" });


// 🔍 Task 3: Advanced Queries

// Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Use projection to return only title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// Sort books by price (descending)
db.books.find().sort({ price: -1 });

// Pagination: limit 5 books per page (Page 1)
db.books.find().limit(5);

// Pagination: Page 2 (skip first 5, limit next 5)
db.books.find().skip(5).limit(5);


// 📊 Task 4: Aggregation Pipeline

// Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// Author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


// ⚡ Task 5: Indexing

// Create an index on the title field
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to show performance with an index (e.g., search by title)
db.books.find({ title: "The Hobbit" }).explain("executionStats");

// Use explain() on compound index
db.books.find({ author: "J.R.R. Tolkien", published_year: { $gte: 1950 } }).explain("executionStats");
