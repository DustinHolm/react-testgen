import { FC } from "react";


interface ReactFCDependencyProps {
    content: string
}

const ReactFCDependency: FC<ReactFCDependencyProps> = (props) => {
    return (
        <p>
            This should never be displayed. With props: {props.content}
        </p>
    )
}

export default ReactFCDependency
