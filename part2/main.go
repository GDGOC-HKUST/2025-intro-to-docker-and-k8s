package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	// Database connection parameters from environment variables
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// Construct connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	// Connect to database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}
	defer db.Close()

	// Test database connection
	if err = db.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	// Simple handler to test database
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Example: Create a table if it doesn't exist
		_, err := db.Exec(`CREATE TABLE IF NOT EXISTS visits (
			id SERIAL PRIMARY KEY,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`)
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		// Insert a visit record
		_, err = db.Exec("INSERT INTO visits DEFAULT VALUES")
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		// Count total visits
		var count int
		err = db.QueryRow("SELECT COUNT(*) FROM visits").Scan(&count)
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "Hello! Total visits: %d", count)
	})

	// Start server
	const port = ":8080"
	fmt.Printf("Server started at: http://localhost%s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}