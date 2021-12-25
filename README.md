# react-testgen

React-testgen is a CLI tool to quickly generate unit test scaffolds for 
TypeScript-based React components.

## Installation

You can either install it globally by running
```
npm i -g react-testgen
```
or use npx to execute it directly
```
npx react-testgen
```

## Usage

```
react-testgen [path/to/file.tsx]
```
This will generate a 'file.test.tsx' adjacent to the specified file. If this
file already exists, it will stop the generator without overwriting the existing
file.

It currently supports React.Components, React.FC and other classes and functions
that return JSX.Element.

## Example

For a simple component like this
```
import { FC } from "react";
import Child from "./Child";


interface ExampleProps {
    content: string
}

const Example: FC<ExampleProps> = (props) => {
    return (
        <div>
            Amazing content: {props.content}
            <Child />
        </div>
    )
}

export default Example
```
the following test file will be generated
```
import { render, screen } from "@testing-library/react"
import Example from "./Example"


describe("Example Tests", () => {
    beforeEach(() => {
        resetMocks()
    })

    test("Component renders", () => {
        whenComponentIsRendered()
        screen.debug()
    })
})

function resetMocks() {
    resetMockPropContent()
    resetMockChild()
}

let mockChild: jest.Mock
let mockChildReturn: JSX.Element
function resetMockChild() {
    mockChildReturn = <span data-testid={"mockChild"} />
    mockChild = jest.fn(() => mockChildReturn)
}
jest.mock("./Child", () => ({
    __esmodule: true,
    default: (...args: any[]) => mockChild(args),
}))

let mockPropContent: string
function resetMockPropContent() {
    mockPropContent = "abcd"
}
function givenMockPropContent(given: string) {
    mockPropContent = given
}

function whenComponentIsRendered() {
    return render(
        <Example
            content={mockPropContent}
        />
    )
}

function thenChildIsRendered(expected: boolean) {
    if (expected) {
        expect(screen.getByTestId("mockChild")).toBeInTheDocument()
    } else {
        expect(screen.queryByTestId("mockChild")).toBeNull()
    }
}

function thenChildWasCalledWith(props: any) {
    expect(mockChild).toHaveBeenCalledWith(props)
}
```

This creates simple methods to write tests like the following
```
test("Child is rendered", () => {
    whenComponentIsRendered()
    thenChildIsRendered(true)
})

test("Prop is displayed", () => {
    givenMockPropContent("test string")
    whenComponentIsRendered()
    expect(screen.getByText("test string")).toBeInTheDocument()
})
```

## Troubleshooting

Because react-testgen uses the TypeScript compiler via the amazing
package [ts-morph](https://github.com/dsherret/ts-morph), the resulting test
depends on the possible type inference through TypeScript. If the generated
methods use unexpected types, it may help to add explicit type annotations. 

If your issues are not caused by a lack of type inference, feel free to [open a
issue/bug at GitHub](https://github.com/DustinHolm/react-testgen/issues).

## Roadmap

 - More customizability via CLI arguments
 - Option to directly generate Snapshot tests
 - Handling parameters with Interface/Object types better

If you have some features that you would like to see added, please [open a issue
/enhancement at GitHub](https://github.com/DustinHolm/react-testgen/issues).

## License

[The MIT License](https://opensource.org/licenses/MIT)
