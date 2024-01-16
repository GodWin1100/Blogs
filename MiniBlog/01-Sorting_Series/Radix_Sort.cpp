#include <iostream>
#include <vector>
#include <numeric>
#include <cmath>

using namespace std;

void printArr(vector<int> arr)
{
  for (auto e : arr)
    cout << e << " ";
  cout << endl;
}

int getDigit(int num, int position)
{
  return (int)(abs(num) / pow(10, position)) % 10;
}

int digitCount(int num)
{
  return num ? log10(num) + 1 : 1;
}

int mostDigits(vector<int> nums)
{
  int max_digits{0};
  for (auto &&num : nums)
    max_digits = max(digitCount(num), max_digits);
  return max_digits;
}

void radixSort(vector<int> arr)
{
  cout << string(5, '-')
       << "Radix Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int max_digits = mostDigits(arr);
  for (int k = 0; k < max_digits; k++)
  {
    vector<vector<int>> digitBucket(10, vector<int>{});
    for (auto &&num : arr)
      digitBucket[getDigit(num, k)].push_back(num);
    // -----
    arr = accumulate(
        digitBucket.begin(), digitBucket.end(),
        vector<int>(),
        [](vector<int> a, vector<int> b)
        {
          a.insert(a.end(), b.begin(), b.end());
          return a;
        });
    // -----
    // arr.erase(arr.begin(), arr.end());
    // for (auto &&elem : digitBucket)
    //   arr.insert(arr.end(), elem.begin(), elem.end());
    // -----
  }
  cout << "Sorted Array:\n";
  printArr(arr);
}

int main()
{
  vector<int> arr{9, 23, 6, 235, 563, 34, 99, 999, 4563, 7357, 2463, 5, 2000, 1246, 78};
  radixSort(arr);
  return 0;
}

/*

-----Radix Sort-----
Initial Array:
9 23 6 235 563 34 99 999 4563 7357 2463 5 2000 1246 78
Sorted Array:
5 6 9 23 34 78 99 235 563 999 1246 2000 2463 4563 7357

*/