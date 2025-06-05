// PLAGIO EVIDENTE - Copia exacta con nombres diferentes - Estudiante 20
public class MathCalculator {
    
    public static void main(String[] args) {
        MathCalculator calc = new MathCalculator();
        System.out.println("Suma: " + calc.sumar(10, 5));
        System.out.println("Resta: " + calc.restar(10, 5));
        System.out.println("Multiplicación: " + calc.multiplicar(10, 5));
        System.out.println("División: " + calc.dividir(10, 5));
    }
    
    public int sumar(int a, int b) {
        return a + b;
    }
    
    public int restar(int a, int b) {
        return a - b;
    }
    
    public int multiplicar(int a, int b) {
        return a * b;
    }
    
    public double dividir(int a, int b) {
        if (b != 0) {
            return (double) a / b;
        }
        return 0;
    }
}
