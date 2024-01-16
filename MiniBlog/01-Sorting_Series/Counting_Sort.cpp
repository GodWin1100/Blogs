#include <iostream>
#include <vector>

using namespace std; // avoid using namespace globally

void printArr(vector<int> arr)
{
  for (auto e : arr)
    cout << e << " ";
  cout << endl;
}

void counting_sort(vector<int> arr)
{
  cout << string(5, '-')
       << "Counting Sort"
       << string(5, '-') << "\n";
  cout << "Initial Array:\n";
  printArr(arr);
  int n = arr.size();
  vector<int> count(101, 0), res(n); // assuming elements ranges from 0 to 100;
  for (int i = 0; i < n; i++)
    count[arr[i]]++;
  for (size_t i = 0; i < count.size() - 1; i++) // accumulate sum
    count[i + 1] += count[i];
  for (int i = 0; i < n; i++)
    res[--count[arr[i]]] = arr[i];
  cout << "Sorted Array:\n";
  printArr(res);
}

int main()
{
  vector<int> arr{3, 1, 1, 2, 8, 5, 6, 7, 3, 1, 6, 7, 5, 5};
  counting_sort(arr);
}

/*

-----Counting Sort-----
Initial Array:
3 1 1 2 8 5 6 7 3 1 6 7 5 5
Sorted Array:
1 1 1 2 3 3 5 5 5 6 6 7 7 8

*/