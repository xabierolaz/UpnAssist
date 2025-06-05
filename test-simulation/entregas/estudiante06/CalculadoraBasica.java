// Plagio con comentarios añadidos - Estudiante 06
public class CalculadoraBasica {
    
    public static void main(String[] args) {
        // Crear instancia de calculadora
        CalculadoraBasica calc = new CalculadoraBasica();
        // Probar operaciones
        System.out.println("Suma: " + calc.sumar(10, 5));
        System.out.println("Resta: " + calc.restar(10, 5));
        System.out.println("Multiplicación: " + calc.multiplicar(10, 5));
        System.out.println("División: " + calc.dividir(10, 5));
    }
    
    // Método para sumar dos números
    public int sumar(int a, int b) {
        return a + b;
    }
    
    // Método para restar dos números
    public int restar(int a, int b) {
        return a - b;
    }
    
    // Método para multiplicar dos números
    public int multiplicar(int a, int b) {
        return a * b;
    }
    
    // Método para dividir dos números
    public double dividir(int a, int b) {
        if (b != 0) {
            return (double) a / b;
        }
        return 0;
    }
}
