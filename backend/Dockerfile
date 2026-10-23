# Etapa 1: Build da aplicação usando Maven com Java 21
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# Copia o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código fonte e gera o pacote .jar (pulando os testes)
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Execução com a imagem do Java 21 (JRE)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o JAR gerado na etapa anterior.
COPY --from=build /app/target/*.jar app.jar

#Expõe a porta oficial da API
EXPOSE 8000

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]