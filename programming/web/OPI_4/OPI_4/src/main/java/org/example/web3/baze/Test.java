package org.example.web3.baze;
import java.sql.*;
public class Test {
    public static final String DATABASE_DOCKER_URL = "jdbc:postgresql://172.18.0.2:5433/postgres";
//    public static final String DATABASE_HELIOS_URL = "jdbc:postgresql://localhost:5432/studs";
    public static Statement statmt;
    public static Connection connection;
    public static void test(){
        try {
            Class.forName("org.postgresql.Driver");
//            connection = DriverManager.getConnection(DATABASE_HELIOS_URL);
            connection = DriverManager.getConnection(
                    Test.DATABASE_DOCKER_URL,
                    "postgres",
                    "postgres"
            );
            System.out.println("Успешное подключение к базе данных PostgreSQL!");
            statmt = connection.createStatement();
            System.out.println(statmt);
        } catch (SQLException e) {
            System.out.println("Ошибка подключения к базе данных: " + e.getMessage());
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
