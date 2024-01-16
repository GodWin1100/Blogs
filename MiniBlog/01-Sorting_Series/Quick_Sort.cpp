#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void printArr(vector<int> arr)
{
  for (auto e : arr)
    cout << e << " ";
  cout << endl;
}

int pivotHelper(std::vector<int> &arr, int start, int end)
{
  int pivot_val = arr[start];
  int swap_idx = start;
  for (int i = start + 1; i <= end; i++)
    if (pivot_val > arr[i])
      std::swap(arr[i], arr[++swap_idx]);
  std::swap(arr[start], arr[swap_idx]);
  return swap_idx;
}

void quickSort(std::vector<int> &arr, int left, int right)
{
  if (left >= right)
    return;
  int pivot_idx = pivotHelper(arr, left, right);
  quickSort(arr, left, pivot_idx - 1);
  quickSort(arr, pivot_idx + 1, right);
}

int main()
{
  vector<int> arr{29, 10, 9, 11, 14, 37, 17};
  int n = arr.size();
  cout << string(5, '-')
       << "Quick Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  quickSort(arr, 0, n - 1);
  cout << "Sorted Array:\n";
  printArr(arr);
  return 0;
}