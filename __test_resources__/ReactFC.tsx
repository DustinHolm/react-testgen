import { FC, useState } from "react"
import ReactFCDependency from "./ReactFCDependency"
import { utilitySquareFunction } from "./utilityFunctions"


interface ReactFCProps {
    content: string
}

const ReactFC: FC<ReactFCProps> = (props) => {
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
            <ReactFCDependency content={"From ReactFC"} />
        </div>
    )
}

export default ReactFC
