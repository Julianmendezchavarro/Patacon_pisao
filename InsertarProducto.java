import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class InsertarProducto {
    public static void main(String[] args) {
        // Consulta para insertar un producto de ejemplo en la tabla productos.
        String sql = "INSERT INTO productos (categoria, nombre, descripcion, precio, disponible) VALUES (?, ?, ?, ?, ?)";

        // Abre la conexion con la base principal del proyecto.
        try (Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/patacon_pisao",
                "root",
                ""
            );
            PreparedStatement ps = con.prepareStatement(sql)) {

            // Asigna los datos del producto que se quiere registrar.
            ps.setString(1, "Especiales");
            ps.setString(2, "Producto de prueba");
            ps.setString(3, "Registro creado desde Java para probar la insercion.");
            ps.setDouble(4, 15000);
            ps.setInt(5, 1);

            // Ejecuta la insercion y confirma el resultado en consola.
            ps.executeUpdate();
            System.out.println("Producto insertado correctamente");
        } catch (Exception e) {
            // Muestra el error en consola si algo falla al guardar.
            System.out.println("Error: " + e.getMessage());
        }
    }
}
