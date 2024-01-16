#include <iostream>
#include <vector>

using namespace std; // avoid using namespace globally

void printArr(vector<int> arr)
{
  for (auto e : arr)
    cout << e << " ";
  cout << endl;
}

void mergeArr(vector<int> &arr, int low, int mid, int high)
{
  vector<int> temp;
  int left = low, right = mid + 1;
  while (left <= mid && right <= high)
  {
    if (arr[left] < arr[right])
      temp.push_back(arr[left++]);
    else
      temp.push_back(arr[right++]);
  }
  while (left <= mid)
    temp.push_back(arr[left++]);
  while (right <= high)
    temp.push_back(arr[right++]);
  for (int i = low; i <= high; i++)
    arr[i] = temp[i - low];
}

void mergeSort(vector<int> &arr, int low, int high)
{
  if (low >= high)
    return;
  int mid = (low + high) / 2;
  mergeSort(arr, low, mid);
  mergeSort(arr, mid + 1, high);
  mergeArr(arr, low, mid, high);
}

int main()
{
  vector<int> arr{29, 10, 9, 11, 14, 37, 17};
  int n = arr.size();
  cout << string(5, '-')
       << "Merge Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  mergeSort(arr, 0, n - 1);
  cout << "Sorted Array:\n";
  printArr(arr);
  return 0;
}

/*

-----Merge Sort-----
Initial Array:
29 10 9 11 14 37 17
Sorted Array:
9 10 11 14 17 29 37

*/