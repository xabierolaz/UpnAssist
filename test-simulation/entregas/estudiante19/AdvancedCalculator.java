// Implementación con enum - Estudiante 19
public class AdvancedCalculator {
    enum Operation {
        ADD { double apply(double x, double y) { return x + y; } },
        SUBTRACT { double apply(double x, double y) { return x - y; } },
        MULTIPLY { double apply(double x, double y) { return x * y; } },
        DIVIDE { 
            double apply(double x, double y) { 
                return y != 0 ? x / y : Double.POSITIVE_INFINITY; 
            } 
        };
        
        abstract double apply(double x, double y);
    }
    
    public static void main(String[] args) {
        double a = 10, b = 5;
        for (Operation op : Operation.values()) {
            System.out.printf("%s: %.2f%n", op, op.apply(a, b));
        }
    }
}
