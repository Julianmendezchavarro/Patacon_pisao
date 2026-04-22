import java.sql.Connection;
import java.sql.DriverManager;

public class Conexion {
    public static void main(String[] args) {
        // Carga el driver de MySQL para poder abrir la conexion.
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Abre la conexion con la misma base usada por el proyecto web.
            try (Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/patacon_pisao",
                "root",
                ""
            )) {
                // Muestra un mensaje si la conexion se hizo correctamente.
                System.out.println("Conectado correctamente");
            }
        } catch (Exception e) {
            // Muestra el error en consola si la conexion falla.
            System.out.println("Error: " + e.getMessage());
        }
    }
}
