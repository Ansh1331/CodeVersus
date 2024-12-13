import java.util.*;

public class Main {

    ##USER_CODE_HERE##

    public static void main(String[] args) {
        // Read input from standard input (stdin)
        Scanner scanner = new Scanner(System.in);
        List<Integer> inputs = new ArrayList<>();

        // Read integers from input
        while (scanner.hasNextInt()) {
            inputs.add(scanner.nextInt());
        }

        if (inputs.size() < 2) {
            System.err.println("Insufficient input values.");
            return; // Exit with an error
        }

        // Call the sum function with the first two inputs
        int num1 = inputs.get(0);
        int num2 = inputs.get(1);
        int result = sum(num1, num2);
        System.out.println(result);
    }
}
