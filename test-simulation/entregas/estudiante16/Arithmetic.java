// Solución muy diferente - Estudiante 16
public class Arithmetic {
    public static double add(double x, double y) { return x + y; }
    public static double subtract(double x, double y) { return x - y; }
    public static double multiply(double x, double y) { return x * y; }
    public static double divide(double x, double y) { 
        return y == 0 ? Double.NaN : x / y; 
    }
    
    public static void main(String[] args) {
        double[] nums = {10.0, 5.0};
        System.out.printf("%.2f + %.2f = %.2f%n", nums[0], nums[1], add(nums[0], nums[1]));
        System.out.printf("%.2f - %.2f = %.2f%n", nums[0], nums[1], subtract(nums[0], nums[1]));
        System.out.printf("%.2f * %.2f = %.2f%n", nums[0], nums[1], multiply(nums[0], nums[1]));
        System.out.printf("%.2f / %.2f = %.2f%n", nums[0], nums[1], divide(nums[0], nums[1]));
    }
}
