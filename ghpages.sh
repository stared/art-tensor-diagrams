rm -rf build
mkdir build
cp main.html build/index.html
cp tensorDiagram.css build/
cp -r main_files build/
push-dir --dir=build --branch=gh-pages