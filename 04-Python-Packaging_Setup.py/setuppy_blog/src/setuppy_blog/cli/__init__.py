import argparse
import sys
from operator import itemgetter

from setuppy_blog.func.basic_math import add, divide, multiply, subtract
from setuppy_blog.utils import rule


def main():
    try:
        parser = argparse.ArgumentParser(
            prog="Setup.py Blog: Math Operator CLI",
            description="Performs basic mathematical operations",
            epilog="Part of Setup.py: Python Packaging - by Shivam Panchal (GodWin1100)",
        )
        parser.add_argument(
            "OPERATION",
            choices=["add", "subtract", "multiply", "divide"],
            help="type of operation to perform",
        )
        parser.add_argument("num1", type=float, help="First Number")
        parser.add_argument("num2", type=float, help="Second Number")
        if len(sys.argv) == 1:
            parser.print_help(sys.stderr)
            sys.exit(1)
        args = parser.parse_args()
        operation, num1, num2 = itemgetter("OPERATION", "num1", "num2")(
            vars(args)
        )
        print(f"{operation.capitalize()}:")
        rule()
        match operation:
            case "add":
                add(num1, num2)
            case "subtract":
                subtract(num1, num2)
            case "multiply":
                multiply(num1, num2)
            case "divide":
                divide(num1, num2)
            case _:
                print("Valid choice are add, subtract, multiply, divide")
    except Exception as e:
        print(f"{type(e).__name__}: {e}")


if __name__ == "__main__":
    main()
