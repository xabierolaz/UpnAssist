// Implementación funcional - Estudiante 17
import java.util.function.BinaryOperator;

public class FunctionalCalculator {
    private static final BinaryOperator<Integer> ADD = (a, b) -> a + b;
    private static final BinaryOperator<Integer> SUB = (a, b) -> a - b;
    private static final BinaryOperator<Integer> MUL = (a, b) -> a * b;
    private static final BinaryOperator<Double> DIV = (a, b) -> b != 0 ? a / b : 0.0;
    
    public static void main(String[] args) {
        int x = 10, y = 5;
        System.out.println("Suma: " + ADD.apply(x, y));
        System.out.println("Resta: " + SUB.apply(x, y));
        System.out.println("Multiplicación: " + MUL.apply(x, y));
        System.out.println("División: " + DIV.apply((double)x, (double)y));
    }
}
