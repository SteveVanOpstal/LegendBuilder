cd src
tsc -m commonjs -t es5 --experimentalDecorators --sourceMap --emitDecoratorMetadata lolApi.ts
tsc -m commonjs -t es5 --experimentalDecorators --sourceMap --emitDecoratorMetadata app.ts
cd ..