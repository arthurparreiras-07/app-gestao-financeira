// Teste para verificar API do FileSystem
import * as FileSystem from "expo-file-system";

console.log("FileSystem exports:", Object.keys(FileSystem));
console.log("documentDirectory:", (FileSystem as any).documentDirectory);
