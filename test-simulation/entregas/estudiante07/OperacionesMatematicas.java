// Aproximación orientada a objetos - Estudiante 07
public class OperacionesMatematicas {
    private int operando1;
    private int operando2;
    
    public OperacionesMatematicas(int a, int b) {
        this.operando1 = a;
        this.operando2 = b;
    }
    
    public int obtenerSuma() {
        return operando1 + operando2;
    }
    
    public int obtenerResta() {
        return operando1 - operando2;
    }
    
    public int obtenerProducto() {
        return operando1 * operando2;
    }
    
    public double obtenerCociente() {
        return operando2 != 0 ? (double) operando1 / operando2 : 0;
    }
    
    public static void main(String[] args) {
        OperacionesMatematicas ops = new OperacionesMatematicas(10, 5);
        System.out.println("Suma: " + ops.obtenerSuma());
        System.out.println("Resta: " + ops.obtenerResta());
        System.out.println("Multiplicación: " + ops.obtenerProducto());
        System.out.println("División: " + ops.obtenerCociente());
    }
}
