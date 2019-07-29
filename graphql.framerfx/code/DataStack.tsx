import * as React from "react"
import { useEffect, useMemo } from "react"
import { addPropertyControls, ControlType, Stack, RenderTarget } from "framer"
import useFetch from "use-http"
import deepIterator from "deep-iterator"

enum Direction {
    Vertical = "vertical",
    Horizontal = "horizontal",
}

enum Alignment {
    Start = "start",
    Center = "center",
    End = "end",
}

enum Distribution {
    Start = "start",
    Center = "center",
    End = "end",
    SpaceBetween = "space-between",
    SpaceAround = "space-around",
    SpaceEvenly = "space-evenly",
}

const GraphQLLogo = props => (
    <svg viewBox="0 0 400 400" {...props}>
        <path
            fill="#E535AB"
            d="M57.468 302.66l-14.376-8.3 160.15-277.38 14.376 8.3z"
        />
        <path fill="#E535AB" d="M39.8 272.2h320.3v16.6H39.8z" />
        <path
            fill="#E535AB"
            d="M206.348 374.026l-160.21-92.5 8.3-14.376 160.21 92.5zM345.522 132.947l-160.21-92.5 8.3-14.376 160.21 92.5z"
        />
        <path
            fill="#E535AB"
            d="M54.482 132.883l-8.3-14.375 160.21-92.5 8.3 14.376z"
        />
        <path
            fill="#E535AB"
            d="M342.568 302.663l-160.15-277.38 14.376-8.3 160.15 277.38zM52.5 107.5h16.6v185H52.5z"
        />
        <path fill="#E535AB" d="M330.9 107.5h16.6v185h-16.6z" />
        <path
            fill="#E535AB"
            d="M203.522 367l-7.25-12.558 139.34-80.45 7.25 12.557z"
        />
        <path
            fill="#E535AB"
            d="M369.5 297.9c-9.6 16.7-31 22.4-47.7 12.8-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.7-12.8 16.8 9.7 22.5 31 12.8 47.7M90.9 137c-9.6 16.7-31 22.4-47.7 12.8-16.7-9.6-22.4-31-12.8-47.7 9.6-16.7 31-22.4 47.7-12.8 16.7 9.7 22.4 31 12.8 47.7M30.5 297.9c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.7 12.8 9.6 16.7 3.9 38-12.8 47.7-16.8 9.6-38.1 3.9-47.7-12.8M309.1 137c-9.6-16.7-3.9-38 12.8-47.7 16.7-9.6 38-3.9 47.7 12.8 9.6 16.7 3.9 38-12.8 47.7-16.7 9.6-38.1 3.9-47.7-12.8M200 395.8c-19.3 0-34.9-15.6-34.9-34.9 0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9 0 19.2-15.6 34.9-34.9 34.9M200 74c-19.3 0-34.9-15.6-34.9-34.9 0-19.3 15.6-34.9 34.9-34.9 19.3 0 34.9 15.6 34.9 34.9 0 19.3-15.6 34.9-34.9 34.9"
        />
    </svg>
)

export function DataStack({
    query: queryString,
    children,
    direction,
    alignment,
    gap,
    padding,
    paddingPerSide,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    radius,
    distribute,
    overflow,
    width,
    height,
    loading: LoadingComponent,
    error: ErrorComponent,
    url,
    forceState,
}) {
    const { data, loading, error, query } = useFetch(url)
    useEffect(() => {
        query(queryString)
    }, [queryString])

    const Component = children[0]

    const { stack, stackProps } = useMemo(() => {
        let stack
        let stackProps = []
        for (let { key, value } of deepIterator(data)) {
            if (key === "stack") {
                stack = value
            }
        }
        if (stack) {
            stack.map(item => {
                let propObject = {}
                for (let { key, value, type } of deepIterator(item)) {
                    if (key) {
                        switch (type) {
                            case "String": {
                                propObject[key] = value
                                propObject["key"] = propObject["key"] + value
                            }
                            case "Number": {
                                propObject[key] = String(value)
                                propObject["key"] =
                                    propObject["key"] + String(value)
                            }
                            default: {
                                break
                            }
                        }
                    }
                }
                stackProps.push(propObject)
            })
        }
        return { stack, stackProps }
    }, [data])

    if (data && stack && forceState === "none") {
        return (
            <Stack
                {...{
                    direction,
                    alignment,
                    gap,
                    padding,
                    paddingPerSide,
                    paddingTop,
                    paddingBottom,
                    paddingLeft,
                    paddingRight,
                    radius,
                    distribute,
                    overflow,
                    width,
                    height,
                }}
            >
                {stackProps.map(item => React.cloneElement(Component, item))}
            </Stack>
        )
    } else if (RenderTarget.current() === RenderTarget.thumbnail) {
        return <GraphQLLogo />
    } else if (data && !stack) {
        return "No 'stack' data found. You need to rename a part of the result (eg: 'stack: allAlbums')"
    } else if (loading || forceState === "loading") {
        return LoadingComponent[0] || "loading"
    } else if (error || forceState === "error") {
        return ErrorComponent[0] || "Error"
    } else {
        return ErrorComponent[0] || "I have no idea what's going on."
    }
}

addPropertyControls(DataStack, {
    radius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 0,
        min: 0,
        step: 1,
    },
    overflow: {
        type: ControlType.SegmentedEnum,
        options: ["visible", "hidden"],
        optionTitles: ["Show", "Hide"],
        title: "Overflow",
        defaultValue: "hidden",
    },
    direction: {
        type: ControlType.SegmentedEnum,
        options: [Direction.Horizontal, Direction.Vertical],
        title: "Direction",
        defaultValue: "vertical",
    },
    distribute: {
        type: ControlType.Enum,
        options: [
            Distribution.Start,
            Distribution.Center,
            Distribution.End,
            Distribution.SpaceBetween,
            Distribution.SpaceAround,
            Distribution.SpaceEvenly,
        ],
        optionTitles: [
            "Start",
            "Center",
            "End",
            "Space Between",
            "Space Around",
            "Space Evenly",
        ],
        title: "Distribute",
        defaultValue: "start",
    },
    alignment: {
        type: ControlType.SegmentedEnum,
        options: [Alignment.Start, Alignment.Center, Alignment.End],
        optionTitles: props =>
            props.direction === Direction.Vertical
                ? ["Left", "Center", "Right"]
                : ["Top", "Center", "Bottom"],
        title: "Align",
        defaultValue: "center",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 10,
        min: 0,
        step: 1,
    },
    padding: {
        type: ControlType.FusedNumber,
        toggleKey: "paddingPerSide",
        toggleTitles: ["Padding", "Padding per side"],
        valueKeys: [
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
        ],
        valueLabels: ["t", "r", "b", "l"],
        min: 0,
        title: "Padding",
        defaultValue: 0,
    },
    query: {
        type: ControlType.String,
        defaultValue: "{}",
        placeholder: "GraphQL Query",
        title: "GraphQL",
    },
    url: {
        type: ControlType.String,
        defaultValue: "https://graphql-pokemon.now.sh",
        placeholder: "Endpoint URL",
        title: "URL",
    },
    children: {
        type: ControlType.ComponentInstance,
        title: "Template",
    },
    loading: {
        type: ControlType.ComponentInstance,
        title: "Loading",
    },
    error: {
        type: ControlType.ComponentInstance,
        title: "Error",
    },
    forceState: {
        type: ControlType.SegmentedEnum,
        options: ["none", "error", "loading"],
        optionTitles: ["None", "Error", "Loading"],
        title: "Force State",
        defaultValue: "none",
    },
})
