import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.DriverManager;

public class Conexion {
    public static void main(String[] args) {
        try {
            // 👇 ESTA LÍNEA ES LA CLAVE
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/patacon_db",
                "root",
                ""
            );

            System.out.println("Conectado correctamente 🔥");

        } catch (Exception e) {
            System.out.println("Error: " + e);
        }
    }
}