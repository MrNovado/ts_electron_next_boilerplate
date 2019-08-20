{
    echo -e "\e[34mCopying package.json\e[0m" &&
    node ./script-dev-package.js &&

    ./script-compile-main.sh &&

    echo -e "\e[34mCompiling app-renderer\e[0m" &&
    next build renderer &&
    next export -o ./compiled/renderer renderer &&

    echo -e "\e[34mBuilding distribution package\e[0m" &&
    # electron-builder --dir &&
    electron-builder &&

    echo -e "\e[34mCleaning up...\e[0m" &&
    # it is imperative to remove these!
    # otherwise dev next.js configuration
    # would be corrupted!
    rm -rf compiled/package.json &&
    rm -rf compiled/package-lock.json &&
    rm -rf compiled/node_modules &&
    rm -rf compiled/renderer &&

    echo -e "\e[32mShould be done!\e[0m"
} || {
    echo -e "\e[31mSomething went wrong!\e[0m"
}