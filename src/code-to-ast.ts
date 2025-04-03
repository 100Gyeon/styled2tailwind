/* eslint-disable no-prototype-builtins */
import { parse, ParserOptions } from "@babel/parser"
import * as t from "@babel/types"

export function generateAst(codeInputs: string[]) {
  if (!codeInputs || codeInputs.length === 0) {
    throw new Error("Provided input is empty")
  }

  const mergedCode = codeInputs.join("\n")

  let ast: t.Node
  try {
    ast = parse(mergedCode, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript", "babel-plugin-styled-components"],
    } as ParserOptions)
  } catch (error) {
    throw new Error("Input is not valid JavaScript code", error instanceof Error ? { cause: error.cause } : undefined)
  }

  return ast
}
