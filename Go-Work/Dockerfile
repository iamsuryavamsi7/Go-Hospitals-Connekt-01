# Use the lightweight OpenJDK 21 base image
FROM eclipse-temurin:21-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file into the container
COPY Go-Work-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (same as in your application.yml)
EXPOSE 7777

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
