import java.util.*;

public class Main {

    ##USER_CODE_HERE##

    public static void main(String[] args) {
        // Read input from standard input (stdin)
        Scanner scanner = new Scanner(System.in);
        List<Integer> arr = new ArrayList<>();

        // Read the number of elements in the list
        if (scanner.hasNextInt()) {
            int size = scanner.nextInt();
            
            // Read the elements
            for (int i = 0; i < size; i++) {
                if (scanner.hasNextInt()) {
                    arr.add(scanner.nextInt());
                } else {
                    System.err.println("Insufficient input values.");
                    return; // Exit with an error
                }
            }
        } else {
            System.err.println("Invalid size input.");
            return; // Exit with an error
        }

        // Call the classroom function
        int result = classroom(arr);
        System.out.println(result);
    }
}
