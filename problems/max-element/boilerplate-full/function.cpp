#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <climits>

##USER_CODE_HERE##

int main() {
    // Read input from standard input (stdin)
    std::string input;
    std::vector<int> arr;
    int size_arr;

    // Read the first line for the size of the array
    if (std::getline(std::cin, input)) {
        std::istringstream iss(input);
        iss >> size_arr;
    }

    // Read the second line for the elements of the array
    if (size_arr > 0 && std::getline(std::cin, input)) {
        std::istringstream iss(input);
        arr.resize(size_arr);
        for (int i = 0; i < size_arr; i++) {
            iss >> arr[i];
        }
    }

    int result = maxElement(arr);
    std::cout << result << std::endl;
    return 0;
}
