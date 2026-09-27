#include <stdio.h>

int main()
{
    int   num;
    float dec;
    char  ch;
    char  name[50];
    int   check;

    printf("Integer Input :\n");
    check = scanf("%d", &num);

    if (check == 1)
        printf("Valid! You entered: %d\n", num);
    else
    {
        printf("Error: That is not a valid integer.\n");
        while (getchar() != '\n');
    }

    printf("Enter a decimal number: ");

    check = scanf("%f", &dec);

    if (check == 1)
        printf("Valid! You entered: %.2f\n", dec);
    else
    {
        printf("Error: That is not a valid decimal number.\n");
        while (getchar() != '\n');
    }

    printf("Enter one letter (a-z or A-Z): ");

    scanf(" %c", &ch);

    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))
        printf("Valid! You entered: %c\n", ch);
    else
        printf("Error: '%c' is not a letter.\n", ch);


    return 0;
}
