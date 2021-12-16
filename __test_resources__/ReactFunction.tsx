import { useState } from "react"
import ReactFCDependency from "./ReactFCDependency"
import { utilitySquareFunction } from "./utilityFunctions"


interface ReactFunctionProps {
    content: string
}

function ReactFunction(props: ReactFunctionProps) {
    const [count, setCount] = useState(2)

    const increase = () => {
        setCount(utilitySquareFunction(count))
    }

    return (
        <div>
            <p>ReactFC header</p>
            <p>{props.content}</p>
            <p>{count}</p>
            <button onClick={() => increase()}>increase count</button>
            <ReactFCDependency content={"From ReactFunction"} />
        </div>
    )
}

export default ReactFunction
