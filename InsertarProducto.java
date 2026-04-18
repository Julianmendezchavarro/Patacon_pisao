import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class InsertarProducto {
    public static void main(String[] args) {
        try {
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/patacon_db",
                "root",
                ""
            );

            String sql = "INSERT INTO productos (nombre, precio) VALUES (?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, "Patacón con pollo");
            ps.setDouble(2, 15000);

            ps.executeUpdate();

            System.out.println("Producto insertado");

            con.close();

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}

