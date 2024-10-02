#include <stdio.h>
#include <vector>

int findMax(const std::vector<int>& nums);

int main() {
    std::vector<int> arr = {1, 2, 3, 4, 5};
    int ans = findMax(arr);
    return 0;
}
