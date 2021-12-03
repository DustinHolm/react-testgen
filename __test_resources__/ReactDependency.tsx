import { FC } from "react";


interface ReactDependencyProps {
    content: string
}

const ReactDependency: FC<ReactDependencyProps> = (props) => {
    return (
        <p>
            This should never be displayed. With props: {props.content}
        </p>
    )
}

export default ReactDependency
