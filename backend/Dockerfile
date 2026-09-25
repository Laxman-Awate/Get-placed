# ================================
# Build Stage
# ================================
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy Maven wrapper and project configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Convert Windows CRLF line endings to Linux LF
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Download Maven dependencies
RUN ./mvnw -B dependency:go-offline

# Copy application source
COPY src ./src

# Build Spring Boot application
RUN ./mvnw -B clean package -DskipTests


# ================================
# Runtime Stage
# ================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy generated Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]