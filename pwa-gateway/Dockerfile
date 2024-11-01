FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17
EXPOSE 8080
WORKDIR /app
COPY --from=build /app/target/pwa-gateway-1.0-SNAPSHOT.jar pwa-gateway.jar
CMD ["java", "-jar", "pwa-gateway.jar"]
