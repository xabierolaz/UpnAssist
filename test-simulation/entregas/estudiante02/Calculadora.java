// Entrega similar pero diferente - Estudiante 02
public class Calculadora {
    
    public static void main(String[] args) {
        Calculadora calculadora = new Calculadora();
        System.out.println("Resultado suma: " + calculadora.suma(15, 8));
        System.out.println("Resultado resta: " + calculadora.resta(15, 8));
        System.out.println("Resultado multiplicación: " + calculadora.multiplica(15, 8));
        System.out.println("Resultado división: " + calculadora.divide(15, 8));
    }
    
    public int suma(int x, int y) {
        return x + y;
    }
    
    public int resta(int x, int y) {
        return x - y;
    }
    
    public int multiplica(int x, int y) {
        return x * y;
    }
    
    public double divide(int x, int y) {
        if (y != 0) {
            return (double) x / y;
        }
        return 0.0;
    }
}
