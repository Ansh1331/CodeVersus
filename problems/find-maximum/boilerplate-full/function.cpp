#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <climits>

##USER_CODE_HERE##

int main() {
    // Read input from standard input (stdin)
    std::string input;
    std::vector<int> inputs;

    while (std::getline(std::cin, input)) {
        std::istringstream iss(input);
        int value;
        while (iss >> value) {
            inputs.push_back(value);
        }
    }

    if (inputs.empty()) {
        std::cerr << "No input values." << std::endl;
        return 1; // Error code
    }

    int result = findMax(inputs);
    std::cout << result << std::endl;
    return 0;
}
