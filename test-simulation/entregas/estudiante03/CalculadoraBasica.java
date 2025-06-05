// PLAGIO EVIDENTE - Solo cambió nombres de variables - Estudiante 03
public class CalculadoraBasica {
    
    public static void main(String[] args) {
        CalculadoraBasica calc = new CalculadoraBasica();
        System.out.println("Suma: " + calc.sumar(10, 5));
        System.out.println("Resta: " + calc.restar(10, 5));
        System.out.println("Multiplicación: " + calc.multiplicar(10, 5));
        System.out.println("División: " + calc.dividir(10, 5));
    }
    
    public int sumar(int num1, int num2) {
        return num1 + num2;
    }
    
    public int restar(int num1, int num2) {
        return num1 - num2;
    }
    
    public int multiplicar(int num1, int num2) {
        return num1 * num2;
    }
    
    public double dividir(int num1, int num2) {
        if (num2 != 0) {
            return (double) num1 / num2;
        }
        return 0;
    }
}
