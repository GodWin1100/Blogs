#include <iostream>
#include <vector>

using namespace std; // avoid using namespace globally

void printArr(vector<int> arr)
{
  for (auto e : arr)
    cout << e << " ";
  cout << endl;
}

void insertionSort(vector<int> arr)
{
  cout << string(5, '-')
       << "Insertion Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int n = arr.size(), i, j, curr;
  for (i = 1; i < n; i++)
  {
    curr = arr[i];
    for (j = i - 1; j >= 0 && arr[j] > curr; j--)
      arr[j + 1] = arr[j];
    arr[j + 1] = curr;
  }
  cout << "Sorted Array:\n";
  printArr(arr);
}

int main()
{
  vector<int> arr{29, 10, 9, 11, 14, 37, 17};
  insertionSort(arr);
  return 0;
}

/*

-----Insertion Sort-----
Initial Array:
29 10 9 11 14 37 17
Sorted Array:
9 10 11 14 17 29 37

*/