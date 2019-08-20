echo -e "\e[34mCompiling app-main\e[0m" &&

# testing overall app with general rules-set
tsc -p tsconfig.json &&

# compiling main package with electron rules-set
tsc -p tsconfig.electron.json &&

# switching from abs import aliases back to relative
tscpaths -p tsconfig.electron.json --src . --out ./compiled