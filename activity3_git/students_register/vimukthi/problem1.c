#include <stdio.h>
void printPyramid(int n);

int main() {
    int n = 4;
    printPyramid(n);
    return 0;
}

void printPyramid(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\n");
    }
}