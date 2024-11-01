FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17
EXPOSE 8081
WORKDIR /app
COPY --from=build /app/target/pwa-users-1.0-SNAPSHOT.jar pwa-users.jar
CMD ["java", "-jar", "pwa-users.jar"]
