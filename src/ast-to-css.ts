/* eslint-disable @typescript-eslint/no-explicit-any */
import * as t from "@babel/types"
import { Component } from "./types.js"
import { getStylesfulComponent } from "./utils/get-stylesful-component.js"
import { findComponentUsage } from "./utils/find-component-usage.js"

export function convertASTtoCSS(asts: t.File[]): Omit<Component, "children">[] {
  if (!asts || asts.length === 0) {
    throw new Error("Provided input is empty!")
  }

  const mergedAst: t.File = {
    type: "File",
    program: {
      type: "Program",
      body: [],
      directives: [],
      sourceType: "module",
    },
    comments: [],
  }

  for (const ast of asts) {
    if (!ast.program || !ast.program.body) {
      throw new Error(
        "Provided input is not valid AST! It's probably because you already have Git Conflicts syntax in that file"
      )
    }

    mergedAst.program.body.push(...ast.program.body)
  }

  const styledComponents = []

  for (const node of mergedAst.program.body) {
    if (t.isVariableDeclaration(node) && node.declarations) {
      for (const declaration of node.declarations) {
        if (t.isVariableDeclarator(declaration) && t.isIdentifier(declaration.id)) {
          const component = getStylesfulComponent(declaration, {
            componentName: declaration.id.name,
            tagName: "div",
            staticStyles: "",
            dynamicStyles: "",
            usedIn: [],
          })

          styledComponents.push(component)
        }
      }
    } else if (t.isExportNamedDeclaration(node) || t.isExportDefaultDeclaration(node)) {
      if (node.declaration && t.isVariableDeclaration(node.declaration)) {
        for (const declaration of node.declaration.declarations) {
          if (t.isVariableDeclarator(declaration) && t.isIdentifier(declaration.id)) {
            const component = getStylesfulComponent(declaration, {
              componentName: declaration.id.name,
              tagName: "div",
              staticStyles: "",
              dynamicStyles: "",
              usedIn: [],
            })

            styledComponents.push(component)
          }
        }
      }
    }
  }

  return styledComponents.map((singleComponent) => findComponentUsage(mergedAst, singleComponent))
}
