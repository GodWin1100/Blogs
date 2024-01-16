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

// NOTE: for 1 to N replace `arr[arr[i]]` with `arr[arr[i] - 1]`
void cyclicSort(vector<int> arr)
{
  cout << string(5, '-')
       << "Modified Cyclic Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int n = arr.size(), i = 0;
  while (i < n)
  {
    if (arr[i] == arr[arr[i]]) // Avoid going in infinite loop; if we compare with index, will go in infinite loop with repeated numbers
      i++;
    else
      swap(arr[arr[i]], arr[i]);
  }
  cout << "Sorted Array:\n";
  printArr(arr);
}

int main()
{
  vector<int> arr{10, 8, 6, 4, 3, 7, 2, 5, 0, 9, 1};
  cyclicSort(arr);
}

/*

-----Modified Cyclic Sort-----
Initial Array:
10 8 6 4 3 7 2 5 0 9 1
Sorted Array:
0 1 2 3 4 5 6 7 8 9 10

*/