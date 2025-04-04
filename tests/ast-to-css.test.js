import { describe, it, expect } from "vitest"
import { convertASTtoCSS } from "../src/ast-to-css"
import { regularAST, multipleDeclarationsAST, nestedTemplateAST, exportedComponentsAST } from "./__stubs__/asts"

describe("#convertASTtoCSS", () => {
  it("should generate valid CSS from correct AST input", () => {
    const result = convertASTtoCSS([regularAST])
    expect(result).toEqual(
      expect.arrayContaining([
        {
          componentName: "Button",
          tagName: "button",
          staticStyles:
            "{  background: white; color: palevioletred; font-size: 1em; &:hover { background: palevioletred; color: white; }   }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
      ])
    )
  })

  it("should throw an error when AST input is empty", () => {
    const input = []

    expect(() => convertASTtoCSS(input)).toThrowError("Provided input is empty!")
  })

  it("should throw an error when AST input is not valid", () => {
    const input = ["test"]

    expect(() => convertASTtoCSS(input)).toThrowError("Provided input is not valid AST! It's probably because you already have Git Conflicts syntax in that file")
  })

  it("should generate valid CSS from AST input with multiple tagged template expressions", () => {
    const result = convertASTtoCSS([multipleDeclarationsAST])

    expect(result).toEqual(
      expect.arrayContaining([
        {
          componentName: "Button",
          tagName: "button",
          staticStyles: "{  color: blue }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "RedButton",
          tagName: "div",
          staticStyles: "{  color: red }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "GreenButton",
          tagName: "div",
          staticStyles: "{  color: green }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
      ])
    )
  })

  it("should generate valid CSS from AST input with nested tagged template expressions", () => {
    const result = convertASTtoCSS([nestedTemplateAST])

    expect(result).toEqual(
      expect.arrayContaining([
        {
          componentName: "Button",
          tagName: "button",
          staticStyles: "{  color: blue }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "RedButton",
          tagName: "div",
          staticStyles: "{  color: red }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "GreenButton",
          tagName: "div",
          staticStyles: "{  color: green }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
      ])
    )
  })

  it("should compile when styled component is exported", () => {
    const result = convertASTtoCSS([exportedComponentsAST])

    console.log(JSON.stringify(result, null, 2))

    expect(result).toEqual(
      expect.arrayContaining([
        {
          componentName: "NavigationBar",
          tagName: "div",
          staticStyles: "{  }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "ItemsList",
          tagName: "ul",
          staticStyles:
            "{  display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: MAX_WIDTH.desktop; padding: 12px 0 }",
          dynamicStyles: "{  }",
          usedIn: [
            {
              styledMarkup:
                "<ItemsList>\n        {navItems.map((navItem, index) => <NavItem key={index} isActive={activeTitle === index} id={`navItem.href-navItem`} onClick={() => handleScrollToElement(navItem.href)}>\n            {navItem.title}\n          </NavItem>)}\n      </ItemsList>",
              props: {
                children: [
                  "{navItems.map((navItem, index) => <NavItem key={index} isActive={activeTitle === index} id={`navItem.href-navItem`} onClick={() => handleScrollToElement(navItem.href)}>\n            {navItem.title}\n          </NavItem>)}",
                ],
              },
            },
          ],
        },
        {
          componentName: "StyledNavigationBar",
          tagName: "div",
          staticStyles:
            '{  display: flex; align-items: center; justify-content: center; width: 100%; position: relative; z-index: 10; &:before { content: ""; position: absolute; width: 100%; bottom: 0; left: 0; height: 1px; background: #29303a26; } &:after { content: ""; position: absolute; bottom: 0; left: 0; transition: width 0.5s ease; height: 2px; }   }',
          dynamicStyles:
            "{ background: rgba(255, 255, 255, 0.9), backdrop-filter: blur(16px), width: ({ progress ) => progress}, background: ({ theme ) => theme.colors.primary} }",
          usedIn: [
            {
              styledMarkup:
                "<StyledNavigationBar progress={progress}>\n      <ItemsList>\n        {navItems.map((navItem, index) => <NavItem key={index} isActive={activeTitle === index} id={`navItem.href-navItem`} onClick={() => handleScrollToElement(navItem.href)}>\n            {navItem.title}\n          </NavItem>)}\n      </ItemsList>\n    </StyledNavigationBar>",
              props: {
                progress: "progress",
                children: [
                  "<ItemsList>\n        {navItems.map((navItem, index) => <NavItem key={index} isActive={activeTitle === index} id={`navItem.href-navItem`} onClick={() => handleScrollToElement(navItem.href)}>\n            {navItem.title}\n          </NavItem>)}\n      </ItemsList>",
                ],
              },
            },
          ],
        },
        {
          componentName: "NavItem",
          tagName: "li",
          staticStyles:
            '{  font-weight: 400; font-size: 16px; line-height: 150%; cursor: pointer; position: relative; &:before { content: ""; position: absolute; width: 8px; height: 8px; border-radius: 50%; left: -16px; top: 50%; }   }',
          dynamicStyles:
            "{ color: (props) => (props.isActive ? props.theme.colors.primary, background: ({ theme ) => theme.colors.primary}, transform: translateY(-50%) }",
          usedIn: [
            {
              styledMarkup:
                "<NavItem key={index} isActive={activeTitle === index} id={`navItem.href-navItem`} onClick={() => handleScrollToElement(navItem.href)}>\n            {navItem.title}\n          </NavItem>",
              props: {
                key: "index",
                isActive: "activeTitle === index",
                id: "`navItem.href-navItem`",
                onClick: "() => handleScrollToElement(navItem.href)",
                children: ["{navItem.title}"],
              },
            },
          ],
        },
      ])
    )
  })

  it("should generate valid CSS from multiple AST inputs", () => {
    const result = convertASTtoCSS([regularAST, multipleDeclarationsAST])

    expect(result).toEqual(
      expect.arrayContaining([
        {
          componentName: "Button",
          tagName: "button",
          staticStyles:
            "{  background: white; color: palevioletred; font-size: 1em; &:hover { background: palevioletred; color: white; }   }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "Button",
          tagName: "button",
          staticStyles: "{  color: blue }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "RedButton",
          tagName: "div",
          staticStyles: "{  color: red }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "GreenButton",
          tagName: "div",
          staticStyles: "{  color: green }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
      ])
    )
  })

  it("should generate valid CSS from multiple AST inputs with separate style files", () => {
    const componentAST = {
      type: "File",
      program: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: {
                  type: "Identifier",
                  name: "styled",
                },
              },
            ],
            source: {
              type: "StringLiteral",
              value: "styled-components",
            },
          },
          {
            type: "VariableDeclaration",
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "Identifier",
                  name: "Button",
                },
                init: {
                  type: "TaggedTemplateExpression",
                  tag: {
                    type: "MemberExpression",
                    object: {
                      type: "Identifier",
                      name: "styled",
                    },
                    property: {
                      type: "Identifier",
                      name: "button",
                    },
                  },
                  quasi: {
                    type: "TemplateLiteral",
                    quasis: [
                      {
                        type: "TemplateElement",
                        value: {
                          raw: "\n  background: white;\n  color: palevioletred;\n  font-size: 1em;\n  &:hover {\n    background: palevioletred;\n    color: white;\n  }\n",
                          cooked: "\n  background: white;\n  color: palevioletred;\n  font-size: 1em;\n  &:hover {\n    background: palevioletred;\n    color: white;\n  }\n",
                        },
                        tail: true,
                      },
                    ],
                    expressions: [],
                  },
                },
              },
            ],
            kind: "const",
          },
        ],
        directives: [],
        sourceType: "module",
      },
      comments: [],
    }

    const styleAST = {
      type: "File",
      program: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: {
                  type: "Identifier",
                  name: "styled",
                },
              },
            ],
            source: {
              type: "StringLiteral",
              value: "styled-components",
            },
          },
          {
            type: "VariableDeclaration",
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "Identifier",
                  name: "ButtonStyles",
                },
                init: {
                  type: "TaggedTemplateExpression",
                  tag: {
                    type: "MemberExpression",
                    object: {
                      type: "Identifier",
                      name: "styled",
                    },
                    property: {
                      type: "Identifier",
                      name: "button",
                    },
                  },
                  quasi: {
                    type: "TemplateLiteral",
                    quasis: [
                      {
                        type: "TemplateElement",
                        value: {
                          raw: "\n  padding: 0.25em 1em;\n  border: 2px solid palevioletred;\n  border-radius: 3px;\n",
                          cooked: "\n  padding: 0.25em 1em;\n  border: 2px solid palevioletred;\n  border-radius: 3px;\n",
                        },
                        tail: true,
                      },
                    ],
                    expressions: [],
                  },
                },
              },
            ],
            kind: "const",
          },
        ],
        directives: [],
        sourceType: "module",
      },
      comments: [],
    }

    const result = convertASTtoCSS([componentAST, styleAST])

    expect(result).toEqual(
      expect.arrayContaining([
        {
          componentName: "Button",
          tagName: "button",
          staticStyles:
            "{  background: white; color: palevioletred; font-size: 1em; &:hover { background: palevioletred; color: white; }   }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
        {
          componentName: "ButtonStyles",
          tagName: "button",
          staticStyles: "{  padding: 0.25em 1em; border: 2px solid palevioletred; border-radius: 3px; }",
          dynamicStyles: "{  }",
          usedIn: [],
        },
      ])
    )
  })
})
