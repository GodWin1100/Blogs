#!/bin/bash


pushd() {
    command pushd "$@" > /dev/null
}

popd() {
    command popd "$@" > /dev/null
}

cat() {
  echo "$@"
  command cat $@
  echo ""
}

bkln() {
  echo
  if [[ -z $2 ]]
  then
    echo "================================================================================"
    echo "$1"
    echo "================================================================================"
  else
    echo "-------------------------------------------------"
    echo "$1"
    echo "-------------------------------------------------"
  fi
}

git_dir="${1:-Git_Mastering-the-Essentials}"
remote_dir="$git_dir-remote"
git_dir_2="$git_dir-2"

echo "========================================"
echo "Git: Mastering the Essentials"
echo "     - by Shivam Panchal (GodWin1100)"

bkln "Checking version of Git"
git -v

if [[ $? -ne 0 ]]
then
  bkln "git not found" 1
  echo "You can install Git from https://git-scm.com/downloads"
  echo "Ensure git is added to PATH environment variable"
  exit 1
fi

bkln "Creating Directory: $git_dir"
mkdir $git_dir
pushd $git_dir

bkln "Initializing Git Repository"
git init -b main

bkln "Configuring user name and email (locally)"
git config user.name "example"
git config user.email "example@example.com"
git config core.pager '' # for demo purpose, do not use on large project without clear understanding

bkln "Listing all config" 1
git config --list --local

bkln "Creating resources"
echo "Hello World!" > one.txt
echo "Git: Mastering the Essentials" > two.txt
mkdir ./first
echo "From default branch" > ./first/one.txt

ls -R

bkln "Current status of repository" 1
git status

bkln "Staging the resources"
git add .

bkln "Current status of repository" 1
git status

bkln "Committing the resources"
git commit -m "feat(*): initial resources created"

bkln "Current status of repository" 1
git status

bkln "Checking logs"
git log

bkln "Creating a branch(first) and checking out"
git checkout -b first
git branch -l

bkln "Creating resources" 1
echo "From first branch" > three.txt
git add ./three.txt
git commit -m "feat(three.txt): content added"


bkln "Before updating" 1
echo "-----Contents of file-----"
cat ./two.txt
cat ./first/one.txt

bkln "Updating resources" 1
echo " - by Shivam Panchal (GodWin1100)" >> two.txt
echo "From first branch" >> ./first/one.txt

bkln "After updating" 1
echo "-----Contents of file-----"
cat ./two.txt
cat ./first/one.txt

git commit -am "feat(two.txt|first/one.txt): content update"

git log

bkln "Merging branch with default branch"
git checkout main

echo "git log (main)"
git log --oneline
echo ""
echo "git log (first)"
git log --oneline first

bkln "Resources before Merge" 1
ls -R
echo ""
echo "-----Contents of file-----"
cat ./two.txt
cat ./first/one.txt

bkln "Merging the branch" 1
git merge --no-ff first # --no-ff for demo purpose

bkln "Resources after Merge" 1
ls -R
echo ""
echo "-----Contents of file-----"
cat ./two.txt
cat ./first/one.txt

bkln "Creating Local Remote Repository"
popd
mkdir $remote_dir 
pushd $remote_dir
git init --bare

bkln "Adding remote repository" 1
popd
pushd $git_dir
git remote add origin ./../$remote_dir
git remote -v

bkln "Pushing main and setting the upstream branch" 1
git push origin -u main

bkln "Pushing first without setting the upstream branch" 1
git push origin first

bkln "Listing all branch and it's upstream" 1
git branch -avv

bkln "Cloning remote repository"
popd
git clone ./$remote_dir $git_dir_2
pushd $git_dir_2

bkln "Listing remote, branch and it's upstream" 1
git remote -v
echo ""
git branch -avv

bkln "Adding, Updating, and Deleteing resources" 1
rm ./three.txt
echo "From 2nd git repo" > four.txt
echo "Do follow, like and subscribe" > ./one.txt
echo "From pulling" >> ./first/one.txt

git status

bkln "Commiting and Pushing resources" 1
git add .
git commit -m "feat(*): CRUD for pull demo"

echo -e "\n-----Pushing to remote-----"
git push origin

echo -e "\n-----Git Logs-----"
git log --oneline

bkln "Pulling from remote repository in $1"
popd
pushd $git_dir
git pull

bkln "Files and Directories after the Pull" 1
ls -R
popd

bkln "Practical Execution completed"
echo "Git: Mastering the Essentials"
echo "     - by Shivam Panchal (GodWin1100)"
echo "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""
read -n 1 -p "Enter 'y' key to clean all created resources and exit or any other key to exit: " to_delete
echo
if [[ "$to_delete" == "y" || "$to_delete" == "Y" ]]
then
  bkln "Cleaning all files"
  echo "Deleting $git_dir"
  rm -r -f $git_dir
  echo "Deleting $remote_dir"
  rm -r -f $remote_dir
  echo "Deleting $git_dir_2"
  rm -r -f $git_dir_2
  exit 0
fi

bkln "Git Repositories persisted"
echo "Main git repository: $git_dir"
echo "Remote git repository: $remote_dir"
echo "Second git repository: $git_dir_2"

echo "
You can execute other commands from deep dive section.
Follow for more such blog with practical implementations.

GitHub: https://github.com/GodWin1100/Blogs
Medium: https://godwin1100.medium.com/"