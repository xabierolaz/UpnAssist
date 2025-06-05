// Solución completamente diferente - Estudiante 05
import java.util.Scanner;

public class MiCalculadora {
    private Scanner scanner;
    
    public MiCalculadora() {
        this.scanner = new Scanner(System.in);
    }
    
    public void ejecutar() {
        System.out.println("=== CALCULADORA INTERACTIVA ===");
        while (true) {
            mostrarMenu();
            int opcion = scanner.nextInt();
            
            if (opcion == 5) break;
            
            System.out.print("Primer número: ");
            double num1 = scanner.nextDouble();
            System.out.print("Segundo número: ");
            double num2 = scanner.nextDouble();
            
            switch (opcion) {
                case 1: System.out.println("Resultado: " + (num1 + num2)); break;
                case 2: System.out.println("Resultado: " + (num1 - num2)); break;
                case 3: System.out.println("Resultado: " + (num1 * num2)); break;
                case 4: 
                    if (num2 != 0) System.out.println("Resultado: " + (num1 / num2));
                    else System.out.println("Error: División por cero");
                    break;
            }
        }
    }
    
    private void mostrarMenu() {
        System.out.println("\n1. Sumar\n2. Restar\n3. Multiplicar\n4. Dividir\n5. Salir");
        System.out.print("Opción: ");
    }
    
    public static void main(String[] args) {
        new MiCalculadora().ejecutar();
    }
}
