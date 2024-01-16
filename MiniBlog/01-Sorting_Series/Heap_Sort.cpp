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

void heapify(vector<int> &arr, int n, int idx)
{
  int largest = idx, l = 2 * idx + 1, r = 2 * idx + 2;
  if (l < n && arr[l] > arr[largest])
    largest = l;
  if (r < n && arr[r] > arr[largest])
    largest = r;
  if (largest != idx)
  {
    swap(arr[largest], arr[idx]);
    heapify(arr, n, largest);
  }
}

void heapSort(vector<int> arr)
{
  cout << string(5, '-')
       << "Heap Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int n = arr.size();
  // (n/2 - 1) represents the maximum number of nodes that can be present at the deepest level
  // hence with 0 based index, this is the last non-leaf node
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (int i = n - 1; i >= 0; i--)
  {
    swap(arr[i], arr[0]);
    heapify(arr, i, 0); // passing i as the last boundary/element to heapify as last element is sorted
  }
  cout << "Sorted Array:\n";
  printArr(arr);
}

int main()
{
  vector<int> arr{6, 4, 15, 30, 25, 16, 50, 14, 3, 1};
  heapSort(arr);
}

/*

-----Heap Sort-----
Initial Array:
6 4 15 30 25 16 50 14 3 1
Sorted Array:
1 3 4 6 14 15 16 25 30 50

*/