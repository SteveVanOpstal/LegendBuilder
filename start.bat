start "" "%USERPROFILE%\AppData\Roaming\npm\live-server.cmd" --port=5858
cd src
start "" "%USERPROFILE%\AppData\Roaming\npm\tsc.cmd" -w -m commonjs -t es5 --experimentalDecorators --emitDecoratorMetadata app.ts
tsc -w -m commonjs -t es5 --experimentalDecorators --emitDecoratorMetadata --sourceMap app.ts