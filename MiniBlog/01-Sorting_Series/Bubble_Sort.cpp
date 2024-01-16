#include <iostream>
#include <vector>
#include <algorithm>

using namespace std; // avoid using namespace globally

void printArr(vector<int> arr)
{
  for (auto e : arr)
    cout << e << " ";
  cout << endl;
}

void bubbleSort(vector<int> arr)
{
  cout << string(5, '-')
       << "Bubble Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int n = arr.size();
  bool swapped;
  for (int i = 0; i < n; i++)
  {
    swapped = false;
    for (int j = 0; j < n - i - 1; j++)
    {
      if (arr[j] > arr[j + 1])
      {
        swap(arr[j], arr[j + 1]);
        swapped = true;
      }
    }
    if (!swapped)
      break;
  }
  cout << "Sorted Array:\n";
  printArr(arr);
}

int main()
{
  vector<int> arr{29, 10, 9, 11, 14, 37, 17};
  bubbleSort(arr);
  return 0;
}

/*

-----Bubble Sort-----
Initial Array:
29 10 9 11 14 37 17
Sorted Array:
9 10 11 14 17 29 37

*/
