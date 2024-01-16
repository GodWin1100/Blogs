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

void selectionSort(vector<int> arr)
{
  cout << string(5, '-')
       << "Selection Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int n = arr.size();
  for (int i = 0; i < n - 1; i++)
  {
    int min_idx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[min_idx] > arr[j])
        min_idx = j;
    if (i != min_idx)
      swap(arr[min_idx], arr[i]);
  }
  cout << "Sorted Array:\n";
  printArr(arr);
}

int main()
{
  vector<int> arr{29, 10, 9, 11, 14, 37, 17};
  selectionSort(arr);
  return 0;
}

/*

-----Selection Sort-----
Initial Array:
29 10 9 11 14 37 17
Sorted Array:
9 10 11 14 17 29 37

*/