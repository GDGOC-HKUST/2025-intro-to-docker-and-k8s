package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`
}

type Todo struct {
	BaseModel
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

var db *gorm.DB

func connectDB(dsn string, maxRetries int) (*gorm.DB, error) {
	var err error
	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Printf("Successfully connected to database")
			return db, nil
		}
		log.Printf("Failed to connect to database (attempt %d/%d): %v", i+1, maxRetries, err)
		time.Sleep(5 * time.Second) // Wait 5 seconds before retrying
	}
	return nil, fmt.Errorf("failed to connect to database after %d attempts: %v", maxRetries, err)
}

func main() {
	// Get database configuration from environment variables
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// Database connection string using environment variables
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	// Try to connect to database with retries
	var err error
	db, err = connectDB(dsn, 10) // Try 10 times with 5-second intervals
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Check if db is nil (for extra safety)
	if db == nil {
		log.Fatal("Database connection is nil after initialization")
	}

	db.AutoMigrate(&Todo{})

	// Initialize router
	r := gin.Default()

	// Configure CORS middleware
	r.Use(cors.Default())

	// Routes
	r.GET("/todos", getTodos)
	r.POST("/todos", createTodo)
	r.PUT("/todos/:id", updateTodo)
	r.DELETE("/todos/:id", deleteTodo)

	// Start server
	r.Run(":8080")
}

func getTodos(c *gin.Context) {
	var todos []Todo
	db.Find(&todos)
	c.JSON(http.StatusOK, todos)
}

func createTodo(c *gin.Context) {
	var todo Todo
	if err := c.BindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&todo)
	c.JSON(http.StatusCreated, todo)
}

func updateTodo(c *gin.Context) {
	id := c.Param("id")
	var todo Todo
	if err := db.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}
	if err := c.BindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&todo)
	c.JSON(http.StatusOK, todo)
}

func deleteTodo(c *gin.Context) {
	id := c.Param("id")
	var todo Todo
	if err := db.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}
	db.Delete(&todo)
	c.Status(http.StatusNoContent)
}
